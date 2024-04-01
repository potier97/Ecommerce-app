import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
//SERVICES
import { CartService } from 'modules/cart/services/cart.service';
import { UserService } from 'modules/user/services/user.service';
//DTO
import { CreatePurchaseDto } from '../dto/create-purchase.dto';
import { PaginationDto } from 'shared/dtos/pagination.dto';
//INTERFACES
import { IPaginateData } from 'shared/interfaces/paginateData.interface';
//ENTITIES
import { Purchase } from '../entities/purchase.entity';
import { ProductService } from 'modules/product/services/product.service';
import { capitalizeText } from 'shared/util/capitalizateText';
import { ShippingMethod } from 'shared/interfaces/shippingMethod.enum';
import { shippingRates } from 'shared/util/shippingRates';
import { InvoicePdf } from 'shared/interfaces/invoicePdf.interface';
import { IInvoiceData } from 'shared/interfaces/invoiceData.interface';
import { IPrices } from 'shared/interfaces/prices.interface';
import { ICartList } from 'shared/interfaces/cartList.interface';
// import { IInstallment } from 'shared/interfaces/installment.interface';
import { validInstallments } from 'shared/util/installments';
import { ICustomerPurchase } from 'shared/interfaces/customerPurchase';
import { IShippingPurchase } from 'shared/interfaces/shippingPurchase.interface';
import { IInvoicePurchase } from 'shared/interfaces/invoicePurchase.interface';
import { IProductPurchase } from 'shared/interfaces/productPurchase.interface';
import { IPurchase } from 'shared/interfaces/purchase.interface';
import { invoicePdf } from 'shared/util/makePdf';

@Injectable()
export class PurchaseService {
  private readonly logger = new Logger(PurchaseService.name);

  //INTEREST RATE - 5%
  private readonly annualInterest: number = 5;

  constructor(
    @InjectModel(Purchase.name) private purchaseModel: Model<Purchase>,
    private readonly cartService: CartService,
    private readonly userService: UserService,
    private readonly productService: ProductService,
    @InjectConnection() private readonly connection: Connection
  ) {}

  async checkout(
    userId: string,
    createPurchaseDto: CreatePurchaseDto
  ): Promise<string> {
    //INITIALIZE TRANSACTION
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      this.logger.log(`Creating Purchase for user: ${userId}`);
      //VALIDATE IF USER HAS PRODUCTS IN CART
      const userProducts = await this.cartService.getCart(userId);
      if (userProducts.length === 0) {
        this.purchaseException('Cart is empty');
      }

      //GET USER DATA
      const customer = await this.loadUserData(userId);

      //GET PRODUCTS LIST TO BUY
      const products = await this.updateProductStock(userProducts);

      //CALCULATE TOTAL PRICES
      const totalCost = await this.calculateTotalPrice(products);

      //LOAD SHIPPING DATA
      const shipping = this.loadShippingData(createPurchaseDto, totalCost);

      //LOAD INVOICE DATA
      const invoice = this.loadInvoiceData(
        createPurchaseDto,
        totalCost,
        shipping.shippingCost
      );

      //FINAL PAYMENT VALUES
      this.logger.log(`Total Payment: $ ${invoice.total}`);
      this.logger.log(`Debt Payment: $ ${invoice.debt}`);
      this.logger.log(`Amount of products to buy: ${products.length}`);
      //CREATE DOC
      const newPurchase: IPurchase = {
        customer: customer,
        products: products,
        shipping: shipping,
        invoice: invoice,
        active: true,
      };
      if (createPurchaseDto.financed) {
        newPurchase.installments = [];
      }
      const purchase = await this.purchaseModel.create(newPurchase);
      const pId = purchase['_id'];

      if (purchase) {
        await this.cartService.clearCart(userId);
        this.logger.log(`Purchase created: ${pId}`);
      }

      //COMMIT TRANSACTION
      await session.commitTransaction();
      session.endSession();
      //SE CREA LA COMPRA
      return `Purchase created successfully: ${pId}`;
    } catch (e) {
      await session.abortTransaction();
      session.endSession();
      const errorMsg = e.message ? e.message : e;
      this.logger.error(`Error creating purchase: ${errorMsg}`);
      throw new Error(errorMsg);
    }
  }

  /**
   * Load user data to purchase
   * @param userId - User id
   * @returns {{ICustomerPurchase}} - User data
   */
  private async loadUserData(userId: string): Promise<ICustomerPurchase> {
    const user = await this.userService.findOne(userId);
    if (!user) {
      this.purchaseException('User not found');
    }
    const completeName = `${user.firstName} ${user.secondName} ${user.lastName} ${user.familyName}`;
    const capitalizateName = capitalizeText(completeName);
    return {
      userId: user['_id'],
      userName: capitalizateName,
      email: user.email,
      phone: user.phone,
    };
  }

  /**
   * Validate stock product and reduce it
   * @param {{PurchaseItem[]}} products - Products to buy
   * @returns {{PurchaseItem[]}} - Products list with total price
   */
  private async updateProductStock(
    products: ICartList[]
  ): Promise<IProductPurchase[]> {
    const productsToBuy: IProductPurchase[] = [];
    for (const product of products) {
      const id = product.product['_id'];
      const amount = product.quantity;
      //BUSCAR EL PRODUCTO
      const currentProduct = await this.productService.findOne(id);
      if (
        !currentProduct ||
        !currentProduct.active ||
        currentProduct.quantity < product.quantity
      ) {
        this.logger.log(`Product ${id} is not available`);
        continue;
      }
      this.logger.log(`Product ${currentProduct.name} is available`);
      productsToBuy.push({
        product: id,
        name: currentProduct.name,
        quantity: amount,
        category: currentProduct.category,
        price: currentProduct.price,
        tax: currentProduct.tax,
      });
      //REDUCE PRODUCT STOCK
      await this.productService.changeAmount(id, -amount);
    }
    return productsToBuy;
  }

  /**
   * Calculate total price of products
   * @param {{PurchaseItem[]}} products - Products to buy
   * @returns {{IPrices}} - Total prices
   */
  private async calculateTotalPrice(
    products: IProductPurchase[]
  ): Promise<IPrices> {
    const result = products.reduce(
      (acc, curr) => {
        const totalPrice = curr.price * curr.quantity;
        const totalTax = curr.tax * curr.quantity;
        const subtotal = totalPrice - totalTax;
        return {
          subtotal: acc.subtotal + subtotal,
          tax: acc.tax + totalTax,
          total: acc.total + totalPrice,
        };
      },
      {
        tax: 0,
        subtotal: 0,
        total: 0,
      }
    );
    this.logger.log(`Subtotal: $ ${result.subtotal}`);
    this.logger.log(`Total Tax: $ ${result.tax}`);
    this.logger.log(`Total Cost: $ ${result.total}`);
    return result;
  }

  /**
   * Load shipping data to purchase
   * @param createPurchaseDto - Purchase data
   * @param totalCost - Total cost of products
   * @returns {{IShippingPurchase}} - Shipping data
   */
  private loadShippingData(
    createPurchaseDto: CreatePurchaseDto,
    totalCost: IPrices
  ): IShippingPurchase {
    //CALCULATE SHIPPING COST
    const shippingCost = this.calculateShippingCost(
      totalCost.total,
      createPurchaseDto.shippingMethod
    );
    return {
      shippingMethod: createPurchaseDto.shippingMethod,
      address: createPurchaseDto.address,
      city: createPurchaseDto.city,
      country: createPurchaseDto.country,
      shippingCost: shippingCost,
    };
  }

  /**
   * Calculate shipping depending on its category
   * @param price - total price
   * @param category - Shipping category
   * @returns {{number}}
   */
  private calculateShippingCost(
    price: number,
    category: ShippingMethod
  ): number {
    const shippingRate =
      shippingRates[category] || shippingRates[ShippingMethod.OTHER];
    const shippingAmount = price * shippingRate;
    const roundedShippingAmount = parseFloat(shippingAmount.toFixed(2));
    this.logger.log(`Shipping Cost: $ ${roundedShippingAmount}`);
    return roundedShippingAmount;
  }

  /**
   * Load invoice data to purchase
   * @param createPurchaseDto - Purchase data
   * @param productsCost - Total cost of products
   * @returns {{IInvoicePurchase}} - Invoice data
   */
  private loadInvoiceData(
    createPurchaseDto: CreatePurchaseDto,
    productsCost: IPrices,
    shippingCost: number
  ): IInvoicePurchase {
    //TOTAL - PRODUCTS (TAX + SUBTOTAL) + SHIPPING COST
    const totalCost = shippingCost + productsCost.total;
    let totalDebt = 0;
    let shares = 0;
    let currentShare = 0;
    if (createPurchaseDto.financed) {
      totalDebt = totalCost - createPurchaseDto.initialPayment;
      //VALIDATE IF SHARES IS GREATER THAN 1
      if (
        createPurchaseDto.share < 2 &&
        validInstallments.includes(createPurchaseDto.share)
      ) {
        this.purchaseException('Shares must be greater than 1');
      }
      shares = createPurchaseDto.share;
      currentShare = 1;
    }
    return {
      paymentMethod: createPurchaseDto.paymentMethod,
      paid: !createPurchaseDto.financed,
      financed: createPurchaseDto.financed,
      shares: shares,
      currentShare: currentShare,
      subtotal: productsCost.subtotal,
      tax: productsCost.tax,
      otherCosts: 0,
      total: totalCost,
      debt: totalDebt,
      paidAt: new Date(),
    };
  }

  // async calculateFinancedPayment(
  //   installments: number,
  //   initPay: number,
  //   totalProuctPrice: number,
  //   totalCost: number
  // ): Promise<IInstallment> {
  //   //VALIDATE INITIAL PAYMENT IS LESS THAN TOTAL PRODUCTS PRICE
  //   if (initPay >= totalProuctPrice) {
  //     this.purchaseException('Initial payment must be less than total payment');
  //   }
  //   //VALIDATE INSTALLMENTS IS ON THE LIST
  //   const isValid = validInstallments.includes(installments);
  //   if (!isValid || installments < 2) {
  //     this.purchaseException('Invalid installments');
  //   }

  //   this.logger.log(`Total Installments: $ ${installments}`);
  //   this.logger.log(`Initial Payment: $ ${initPay}`);
  //   this.logger.log(`Total Product Price: $ ${totalProuctPrice}`);
  //   this.logger.log(`Total Cost: $ ${totalCost}`);

  //   // const totalDebt = totalCost - initPay;
  //   return {
  //     amount: 0,
  //     dueAt: new Date(),
  //     paymentAt: new Date(),
  //     installment: 0,
  //     overdue: false,
  //     payment: false,
  //     paymentMethod: '',
  //   };
  // }

  /**
   * Return all active purchase
   * @param {{PaginationDto}} params - Pagination data
   * @returns {Promise<Product[]>}
   */
  async findAll(params: PaginationDto): Promise<IPaginateData<Purchase>> {
    const { size, page } = params;
    const total = await this.purchaseModel.countDocuments({ active: true });
    const result: Purchase[] = await this.purchaseModel
      .find(
        { active: true },
        {
          _id: 0,
          products: 0,
          'customer._id': 0,
          'customer.userId': 0,
          'customer.phone': 0,
          'payment._id': 0,
          'payment.paymentMethod': 0,
          'payment.currentShare': 0,
          'payment.debt': 0,
          'payment.tax': 0,
          'payment.subtotal': 0,
          'payment.financed': 0,
          'shipping._id': 0,
          'shipping.address': 0,
          'shipping.country': 0,
          'shipping.shippingCost': 0,
          createdAt: 0,
          updatedAt: 0,
          active: 0,
          __v: 0,
        }
      )
      .skip(page * size)
      .limit(size)
      .exec();
    return {
      data: result,
      meta: {
        currentPage: page,
        itemCount: result.length,
        itemsPerPage: size,
        totalItems: total,
        totalPages: Math.ceil(total / size),
      },
    };
  }

  /**
   * Find active purchase by id
   * @param id - Product id
   * @returns {Promise<Product>}
   */
  async findOne(id: string): Promise<IInvoiceData> {
    const result = await this.purchaseModel
      .findOne(
        { _id: id, active: true },
        {
          'products._id': 0,
          'products.product': 0,
          'products.category': 0,
          'customer._id': 0,
          'customer.userId': 0,
          'customer.phone': 0,
          'invoice._id': 0,
          'shipping._id': 0,
          createdAt: 0,
          updatedAt: 0,
          active: 0,
          __v: 0,
        }
      )
      .exec();
    if (!result) {
      throw new NotFoundException({
        message: 'Purchase not found',
        error: true,
        status: 404,
      });
    }
    return result;
  }

  async payShare(id: string, share: number) {
    const purchase = this.purchaseModel.findByIdAndUpdate(
      { _id: id },
      { $inc: { 'invoice.shares.$[element].paid': share } }
    );
    if (!purchase) {
      throw new NotFoundException({
        message: 'Purchase not found',
        error: true,
        status: 404,
      });
    }
    return purchase;
  }

  calculateInteres(totalChare: number) {
    const interes = this.annualInterest / totalChare;
    return parseFloat(interes.toFixed(3));
  }

  calculateShare(total: number, shares: number) {
    return parseFloat((total / shares).toFixed(2));
  }

  calculateMonthlyPayment(total: number, shares: number) {
    // const share = this.calculateShare(total, shares);
    const interes = this.calculateInteres(total);
    const monthlyPayment = parseFloat(
      ((total * interes) / (1 - Math.pow(1 + interes, -shares))).toFixed(2)
    );
    return monthlyPayment;
  }

  /**
   * Generate invoice pdf by purchase id
   * @param id - pushase id
   * @returns {{InvoicePdf}} - Invoice pdf
   */
  async downloadInvoice(id: string): Promise<InvoicePdf> {
    //VALIDATE IF PURCHASE EXISTS
    const purchase = this.purchaseModel.exists({ _id: id });
    if (!purchase) {
      throw new NotFoundException({
        message: 'Purchase not found',
        error: true,
        status: 404,
      });
    }
    //OBTENER LA FECHA ENFORMATO YYYYMMDD CON DATE-FNS
    const date = new Date();
    const idDate = `${date.getFullYear()}${date.getMonth()}${date.getDate()}`;
    const fileName = `${idDate}-${id}.pdf`;
    const purchaseData = await this.findOne(id);
    //GENERATE PDF
    const data = await invoicePdf(purchaseData);
    return {
      data,
      fileName,
    };
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.purchaseModel.findOneAndUpdate(
      {
        _id: id,
        active: true,
      },
      {
        active: false,
      },
      {
        projection: { _id: 1 },
      }
    );
    if (!result) {
      this.logger.error(`Purchase with id ${id} not found`);
      throw new NotFoundException({
        message: 'Purchase not found',
        error: true,
        status: 404,
      });
    }
    return true;
  }

  private purchaseException(msg: string): void {
    this.logger.error(msg);
    throw new BadRequestException({
      message: msg,
      error: true,
      status: 400,
    });
  }
}
