'use strict'

const { NotFoundError } = require('../core/error.response')
const { cart } = require('../models/cart.model')
const { product } = require('../models/product.model')
const { getProductById } = require('../models/repositories/product.repo')

class CartService {
  static async createCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateOrInsert = {
        $addToSet: { cart_products: product }
      },
      option = { upsert: true, new: true }
    return await cart.findOneAndUpdate(query, updateOrInsert, option)
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product
    const query = {
        cart_userId: userId,
        'cart_products.productId': productId,
        cart_state: 'active'
      },
      updateSet = {
        $inc: {
          'cart_products.$.quantity': quantity
        }
      },
      options = { upsert: true, new: true }
    const result = await cart.findOneAndUpdate(query, updateSet, options).catch(async (data) => {
      return await CartService.createUserCart({ userId, product })
    })
    return result
  }

  static async addToCart({ userId, product = {} }) {
    const userCart = await cart.findOne({ cart_userId: userId })

    if (!userCart) {
      return await this.createCart({ userId, product })
    }

    if (!userCart.cart_products.length) {
      userCart.cart_products = [product]
      return await userCart.save()
    }

    //gio hang da ton tai va co san pham do roi
    return await this.updateUserCartQuantity({ userId, product })
  }

  /*
    shop_opder_ids: [
        {
            shopId,
            item_products: [
                {
                    quantity,
                    price,
                    shopId,
                    old_quantity,
                    productId
                }
            ],
            version
        }
    ]
  */
  static async addToCartV2({ userId, shop_order_ids = [] }) {
    console.log(shop_order_ids)

    const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]

    // check product
    const foundProduct = await getProductById(productId)
    if (!foundProduct) throw new NotFoundError('Product not found')

    // compare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId)
      throw new NotFoundError('Product do not belong to the shop')
    if (quantity === 0) {
      // deleted
    }
    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity
        /*
        quantity và old_quantity được truyền từ frontend. 
        VD đang có số lượng là 10 giảm xuống 8 thì sẽ là 8 - 10 = -2; 
        câu update $inc nhận giá trị -2 sẽ giảm bớt số lượng từ 10 xuống thành 8 được truy vấn xuống db
        */
      }
    })
  }
  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateSet = {
        $pull: {
          cart_products: {
            productId
          }
        }
      }

    const deleteCart = await cart.updateOne(query, updateSet)
    return deleteCart
  }

  static async getListUserCart({ userId }) {
    return await cart
      .findOne({
        cart_userId: +userId
      })
      .lean()
  }
}

module.exports = CartService
