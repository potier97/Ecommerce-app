import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
//SERIVICES
import { CreateCartItemDto } from '../dto/create-cart.dto';
import { Cart } from '../entities/cart.entity';
import { ProductService } from 'modules/product/services/product.service';
import { UpdateCartItemDto } from '../dto/update-cart.dto';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private readonly productService: ProductService
  ) {}

  async addProduct(
    userId: string,
    createCartItemDto: CreateCartItemDto
  ): Promise<any> {
    this.logger.log(`Add product to cart: ${createCartItemDto.product}`);
    //VALIDATE IF PRODUCT EXISTS
    const productExist = await this.productService.productExist(
      createCartItemDto.product
    );
    this.logger.log(`Product exists: ${productExist}`);
    if (!productExist) {
      throw new NotFoundException({
        message: 'Product not found',
        error: true,
        status: 404,
      });
    }
    const existingCartItem = await this.cartModel.findOne(
      {
        userId,
        'products.product': createCartItemDto.product,
      },
      {
        _id: 1,
      }
    );
    this.logger.log(`Existing cart item: ${existingCartItem}`);
    //VALIDATE IF PRODUCT EXISTS ON USER CART
    if (existingCartItem) {
      const cart = await this.cartModel
        .findOneAndUpdate(
          { userId, 'products.product': createCartItemDto.product },
          {
            'products.$.quantity': createCartItemDto.quantity,
          },
          // BEFORE UPDATE QUANTITY
          // {
          //   $inc: { 'products.$.quantity': createCartItemDto.quantity },
          // },
          {
            new: true,
            projection: {
              _id: 0,
              products: 1,
            },
          }
        )
        .exec();
      return cart;
    } else {
      const cart = await this.cartModel.findOneAndUpdate(
        { userId: userId },
        {
          $addToSet: {
            products: createCartItemDto,
          },
          userId: userId,
        },
        {
          upsert: true,
          new: true,
          projection: {
            _id: 0,
            products: 1,
          },
        }
      );
      return cart;
    }
  }

  async getCart(userId: string): Promise<any> {
    this.logger.log(`Get cart for user: ${userId}`);
    const validateUserCart = await this.cartModel.exists({ userId });
    if (!validateUserCart) {
      return {
        products: [],
      };
    }
    // return await this.cartModel
    //   .findOne({ userId }, { _id: 0, products: 1 })
    //   .populate('products.product', {
    //     name: 1,
    //     description: 1,
    //     price: 1,
    //     published: 1,
    //     active: 1,
    //   })
    //   .exec();
    const result = await this.cartModel
      .aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { $limit: 1 },
        {
          $lookup: {
            from: 'product', // Nombre de la colección de productos
            localField: 'products.product', // Campo en el carrito que hace referencia al producto
            foreignField: '_id', // Campo en la colección de productos que hace referencia al ID del producto
            as: 'populatedProducts', // Nombre del campo donde se almacenarán los productos poblados
          },
        },
        {
          $project: {
            _id: 0,
            userId: 1,
            products: {
              $map: {
                input: '$products',
                as: 'product',
                in: {
                  product: {
                    $arrayElemAt: [
                      '$populatedProducts',
                      {
                        $indexOfArray: [
                          '$populatedProducts._id',
                          '$$product.product',
                        ],
                      },
                    ],
                  },
                  quantity: '$$product.quantity',
                },
              },
            },
          },
        },
        {
          $project: {
            products: {
              $filter: {
                input: '$products',
                as: 'product',
                cond: {
                  $and: [
                    { $eq: ['$$product.product.published', true] },
                    { $eq: ['$$product.product.active', true] },
                  ],
                },
              },
            },
          },
        },
        {
          $project: {
            'products.product._id': 1,
            'products.product.name': 1,
            'products.product.description': 1,
            'products.product.price': 1,
            'products.product.quantity': 1,
            'products.quantity': 1,
          },
        },
      ])
      .exec();
    return result[0];
  }

  async removeProduct(
    userId: string,
    updateCartItemDto: UpdateCartItemDto
  ): Promise<boolean> {
    this.logger.log(`Remove product from cart: ${updateCartItemDto.product}`);
    //VALIDATE IF PRODUCT EXISTS ON CART
    const productExist = await this.cartModel.exists({
      userId,
      'products.product': updateCartItemDto.product,
    });
    if (!productExist) {
      throw new NotFoundException({
        message: 'Product not exists in cart',
        error: true,
        status: 404,
      });
    }
    await this.cartModel
      .findOneAndUpdate(
        { userId },
        {
          $pull: {
            products: updateCartItemDto,
          },
        },
        { new: true, projection: { _id: 1 } }
      )
      .exec();
    this.logger.log(`Product removed from cart: ${updateCartItemDto.product}`);
    return true;
  }

  /**
   * Clean user cart and remove all products
   * @param userId - User id
   * @returns {{boolean}}
   */
  async clearCart(userId: string): Promise<boolean> {
    this.logger.log(`Clear cart for user: ${userId}`);
    await this.cartModel
      .findOneAndUpdate(
        { userId },
        {
          $set: {
            products: [],
          },
        },
        {
          projection: { _id: 1 },
        }
      )
      .exec();
    this.logger.log(`Cart cleared for user: ${userId}`);
    return true;
  }
}
