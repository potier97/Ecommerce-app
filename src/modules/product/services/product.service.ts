import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
//SERVICES
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';
import { CategoryProducts } from 'shared/interfaces/categoryProducts.enum';
import { taxRates } from 'shared/util/taxesRates';
import { capitalizeText } from 'shared/util/capitalizateText';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>
  ) {}

  async create(createProductDto: CreateProductDto): Promise<any> {
    const name = capitalizeText(createProductDto.name.trim());
    const description = capitalizeText(createProductDto.description.trim());
    this.logger.log(`Create a new product: ${name}`);
    //SE BUSCA EL PRODUCTO POR EL NOMBRE
    const productExist = await this.productModel.findOne(
      { name },
      { name: 1, _id: 1 }
    );
    console.log(productExist);
    if (productExist) {
      throw new BadRequestException({
        message: 'Product already exists',
        error: true,
        status: 400,
      });
    }
    const taxRate = this.calculateTaxes(
      createProductDto.price,
      createProductDto.category
    );
    //SE CREA EL PRODUCTO
    const product: Product = {
      name: name,
      description: description,
      quantity: createProductDto.quantity,
      category: createProductDto.category,
      price: createProductDto.price,
      publishedAt: new Date(),
      tax: taxRate,
      published: false,
      active: true,
    };
    const result = await this.productModel.create(product);
    this.logger.log(`Create a new product: ${result.id}`);
    return {
      id: result.id,
      name: result.name,
      description: result.description,
      quantity: result.quantity,
      category: result.category,
      price: result.price,
      tax: result.tax,
      publishedAt: result.publishedAt,
      published: result.published,
      active: result.active,
    };
  }

  /**
   * Return all active products
   * @returns {Promise<Product[]>}
   */
  async findAll(): Promise<Product[]> {
    const result = await this.productModel
      .find(
        { active: true },
        {
          name: 1,
          description: 1,
          quantity: 1,
          category: 1,
          price: 1,
          tax: 1,
          publishedAt: 1,
          published: 1,
          active: 1,
        }
      )
      .exec();
    return result;
  }

  /**
   * Find active product by id
   * @param id - Product id
   * @returns {Promise<Product>}
   */
  async findOne(id: string): Promise<Product> {
    const result = this.productModel.findById({ _id: id, active: true }).exec();
    if (!result) {
      throw new NotFoundException({
        message: 'Product not found',
        error: true,
        status: 404,
      });
    }
    return result;
  }

  /**
   * Update product from updateProductDto only if it is active
   * @param id - Product id
   * @param {{updateProductDto}} updateProductDto - Product data to update
   * @returns {{Product}}
   */
  async update(
    id: string,
    updateProductDto: UpdateProductDto
  ): Promise<Product> {
    const customProduct = await this.productModel.findById({ _id: id }).exec();
    if (!customProduct) {
      throw new NotFoundException({
        message: 'Product not found',
        error: true,
        status: 404,
      });
    }
    const newData = { ...updateProductDto };
    //SE VALIDA CAMPOS PARA SU ACTUALIZACION
    if (updateProductDto.price && updateProductDto.category) {
      newData['tax'] = this.calculateTaxes(
        updateProductDto.price,
        updateProductDto.category
      );
    } else if (updateProductDto.price) {
      newData.tax = this.calculateTaxes(
        updateProductDto.price,
        CategoryProducts[customProduct.category]
      );
    } else if (updateProductDto.category) {
      newData.tax = this.calculateTaxes(
        customProduct.price,
        updateProductDto.category
      );
    }
    const result = await this.productModel
      .findByIdAndUpdate(
        { _id: id, active: true },
        { $set: newData },
        {
          new: true,
          projection: {
            name: 1,
            description: 1,
            quantity: 1,
            category: 1,
            price: 1,
            tax: 1,
            publishedAt: 1,
            published: 1,
            active: 1,
          },
        }
      )
      .exec();
    this.logger.log(`Update product: ${result.id}`);
    return result;
  }

  /**
   * Disable products
   * @param id - Product id
   * @returns {boolean}
   */
  async remove(id: string): Promise<boolean> {
    const result = await this.productModel.findByIdAndUpdate(
      {
        _id: id,
        active: true,
      },
      {
        $set: {
          active: false,
        },
      }
    );
    if (!result) {
      throw new NotFoundException({
        message: 'Product not found',
        error: true,
        status: 404,
      });
    }
    return true;
  }

  /**
   * Calculate taxes of a product depending on its category
   * @param price
   * @param category
   * @returns {{number}}
   */
  private calculateTaxes(price: number, category: CategoryProducts): number {
    const taxRate =
      taxRates[category] || taxRates[CategoryProducts.UNCATEGORIZED];
    const taxedAmount = price * taxRate;
    const roundedTaxedAmount = parseFloat(taxedAmount.toFixed(2));
    return roundedTaxedAmount;
  }

  async findByCategory(category: string): Promise<Product[]> {
    const result = await this.productModel
      .find({ category: category, active: true })
      .exec();
    return result;
  }

  async publish(id: string): Promise<Product> {
    const updateProductDto: UpdateProductDto = {
      published: true,
      publishedAt: new Date(),
    };
    return await this.update(id, updateProductDto);
  }

  async unpublish(id: string): Promise<Product> {
    const updateProductDto: UpdateProductDto = {
      published: false,
    };
    return await this.update(id, updateProductDto);
  }

  async scheduleProduct(id: string, date: Date): Promise<Product> {
    const updateProductDto: UpdateProductDto = {
      published: true,
      publishedAt: date,
    };
    return await this.update(id, updateProductDto);
  }

  async changeAmount(id: string, amount: number): Promise<Product> {
    const result = await this.productModel
      .findByIdAndUpdate(
        { _id: id, active: true },
        { $inc: { quantity: amount } },
        {
          new: true,
          projection: {
            name: 1,
            quantity: 1,
            category: 1,
            price: 1,
          },
        }
      )
      .exec();
    if (!result) {
      throw new NotFoundException({
        message: 'Product not found',
        error: true,
        status: 404,
      });
    }
    this.logger.log(`Change ${amount} to product: ${result.id}`);
    return result;
  }
}
