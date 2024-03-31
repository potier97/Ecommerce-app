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
import { PurchaseItem } from '../entities/purchase-item.entity';
import { ShippingMethod } from 'shared/interfaces/shippingMethod.enum';
import { shippingRates } from 'shared/util/shippingRates';
import { InvoicePdf } from 'shared/interfaces/invoicePdf.interface';
import { IInvoiceData } from 'shared/interfaces/invoiceData.interface';
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
      const cart = await this.cartService.getCart(userId);
      if (cart.products.length === 0) {
        throw new BadRequestException({
          message: 'Cart is empty',
          error: true,
          status: 400,
        });
      }

      //GET USER DATA
      const user = await this.userService.findOne(userId);
      const completeName = `${user.firstName} ${user.secondName} ${user.lastName} ${user.familyName}`;
      const capitalizateName = capitalizeText(completeName);

      //VALIDATE IF PURCHASE IS FINANCED AND SHARES IS MORE THAN 1
      if (createPurchaseDto.financed && createPurchaseDto.share < 2) {
        throw new BadRequestException({
          message: 'Shares must be greater than 1',
          error: true,
          status: 400,
        });
      }

      this.logger.log(`Creating Purchase with: ${JSON.stringify(cart)}`);
      //throw new Error('Error');
      const productsToBuy: PurchaseItem[] = [];
      //SE RECORRE CADA UNO DE LOS PRODUCTOS DEL CARRITO Y SE VALIDA SU CANTIDAD PARA COMPRAR
      for (const product of cart.products) {
        const id = product.product['_id'];
        const amount = product.quantity;
        //BUSCAR EL PRODUCTO
        const currentProduct = await this.productService.findOne(id);
        //console.log(currentProduct);
        if (currentProduct && product.quantity <= currentProduct.quantity) {
          this.logger.log(`Product ${currentProduct.name} is available`);
          await productsToBuy.push({
            product: id,
            name: currentProduct.name,
            quantity: amount,
            category: currentProduct.category,
            price: currentProduct.price,
            tax: currentProduct.tax,
          });
          //UPDATE PRODUCT STOCK
          await this.productService.changeAmount(id, -amount);
        }
      }
      //ERROR CONTROL
      //throw new Error('Error');

      const totalCost = await productsToBuy.reduce(
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
      this.logger.log(`Subtotal: $ ${totalCost.subtotal}`);
      this.logger.log(`Total Tax: $ ${totalCost.tax}`);
      this.logger.log(`Total Cost: $ ${totalCost.total}`);

      //CALCULATE SHIPPING COST
      const shippingCost = this.calculateShippingCost(
        totalCost.total,
        createPurchaseDto.shippingMethod
      );
      this.logger.log(`Shipping Cost: $ ${shippingCost}`);

      //VALIDATE INITIAL PAYMENT
      const totalPayment = shippingCost + totalCost.total;
      let totalDebt = 0;
      if (createPurchaseDto.financed) {
        totalDebt = totalPayment - createPurchaseDto.initialPayment;
      }

      this.logger.log(`Total Payment: $ ${totalPayment}`);
      this.logger.log(`Debt Payment: $ ${totalDebt}`);
      this.logger.log(`Amount of products to buy: ${productsToBuy.length}`);

      //VALIDATE IF PURCHASE IS FINANCED AND INITIAL PAYMENT IS LESS THAN TOTAL
      if (
        createPurchaseDto.financed &&
        createPurchaseDto.initialPayment < totalPayment
      ) {
        throw new BadRequestException({
          message: 'Initial payment must be greater than total payment',
          error: true,
          status: 400,
        });
      }

      //ERROR CONTROL
      //throw new Error('Error');
      // console.log('Creating purchase');
      // console.log(productsToBuy);
      //CREATE PURCHASE
      const purchase = await this.purchaseModel.create({
        products: productsToBuy,
        customer: {
          userId: user['_id'],
          userName: capitalizateName,
          email: user.email,
          phone: user.phone,
        },
        shipping: {
          shippingMethod: createPurchaseDto.shippingMethod,
          address: createPurchaseDto.address,
          city: createPurchaseDto.city,
          country: createPurchaseDto.country,
          shippingCost: shippingCost,
        },
        payment: {
          paymentMethod: createPurchaseDto.paymentMethod,
          paid: !createPurchaseDto.financed,
          financed: createPurchaseDto.financed,
          shares: createPurchaseDto.share,
          currentShare: 1,
          subtotal: totalCost.subtotal,
          tax: totalCost.tax,
          total: totalPayment,
          debt: totalDebt,
          paidAt: new Date(),
        },
        active: true,
      });

      if (purchase) {
        await this.cartService.clearCart(userId);
      }
      //await purchase.save({ session });
      this.logger.log(`Purchase created: ${purchase['_id']}`);

      //COMMIT TRANSACTION
      await session.commitTransaction();
      session.endSession();
      //SE CREA LA COMPRA
      return `Purchase created successfully with id: ${purchase['_id']}`;
    } catch (e) {
      await session.abortTransaction();
      session.endSession();
      this.logger.error(`Error creating purchase: ${e.message}`);
      throw new Error(e.message);
    }
  }

  /**
   * Calculate shipping depending on its category
   * @param price - total price
   * @param category - Shipping category
   * @returns {{number}}
   */
  calculateShippingCost(price: number, category: ShippingMethod) {
    const shippingRate =
      shippingRates[category] || shippingRates[ShippingMethod.OTHER];
    const shippingAmount = price * shippingRate;
    const roundedShippingAmount = parseFloat(shippingAmount.toFixed(2));
    return roundedShippingAmount;
  }

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
          'payment._id': 0,
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
      { $inc: { 'payment.shares.$[element].paid': share } }
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
    // console.log(data);
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
}
