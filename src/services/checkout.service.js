'use strict'

const { BadRequestError } = require('../core/error.response')
const orderModel = require('../models/order.model')
const { findCartById } = require('../models/repositories/cart.repo')
const { checkProductByServer } = require('../models/repositories/product.repo')
const { getDiscountAmount } = require('./discount.service')
const { releaseLock, acquireLock } = require('./redis.service')

class CheckoutService {
  /*
    {
        CartId,
        UserId,
        shop_order_ids[
            {
                shopId,
                shop_discount:[],
                item_products:[
                    {
                        price,
                        quantity,
                        productId
                    }
                ]
            },
            {
                shopId,
                shop_discount:[
                    {
                        "shopId",
                        "discountId",
                        'codeId
                    }
                ],
                item_products: [
                    {
                        price,
                        quantity,
                        productId
                    }
                ]
            }
        ]
    }
    */
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    // check cart
    const foundcart = await findCartById(cartId)
    if (!foundcart) {
      throw new BadRequestError('Cart not found')
    }

    const checkout_order = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0
      },
      shop_order_ids_new = []

    //calculate total price
    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]

      const checkProductServer = await checkProductByServer(item_products)

      if (!checkProductServer) {
        throw new BadRequestError('Order wrong')
      }

      const checkoutPrice = checkProductServer.reduce((total, product) => {
        return total + product.price * product.quantity
      }, 0)

      // tong tien truoc khi xu ly discount
      checkout_order.totalPrice += checkoutPrice

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer
      }

      // neu shop discount > 0 thi check xem co hop le hay khong
      if (shop_discounts.length > 0) {
        const { totalPrice = 0, discountAmount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer
        })
        checkout_order.totalDiscount += discountAmount

        if (discountAmount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discountAmount
        }
      }

      //tong thanh toan cuoic ung
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
      shop_order_ids_new.push(itemCheckout)
    }
    return {
      checkout_order,
      shop_order_ids,
      shop_order_ids_new
    }
  }

  //order
  static async orderByUser({ shop_order_ids, userId, cartId, user_address, user_payment }) {
    const { shop_order_ids_new, checkout_order } = await this.checkoutReview({ shop_order_ids, userId, cartId })

    const products = shop_order_ids_new.flatMap((item) => item.item_products)
    const acquireProducts = []
    for (let i = 0; i < products.length; i++) {
      const { quantity, productId } = products[i]

      const keyLock = await acquireLock(productId, quantity, cartId)
      acquireProducts.push(keyLock ? true : false)
      if (!keyLock) {
        await releaseLock(keyLock)
      }
    }
    // check if co 1 san pham het hang
    if (acquireProducts.includes(false)) {
      throw new BadRequestError('Mot so san pham dang duoc cap nhat, vui long quay lai gio hang')
    }

    const newOrder = orderModel.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new
    })

    if (newOrder) {
      //remove product in my cart
    }
  }

  /*
    query order [ user]
  */
  static async getOrderByUser({ userId, page = 1, limit = 10 }) {}

  /*
    query order by order id [ user]
  */
  static async getOneOrderByUser({ orderId }) {}

  /*
    cancel order [ user]
*/
  static async cancelOrder({ orderId }) {}

  /*
  update order [Shop\Admin]
  */
  static async updateOrder({ orderId, status }) {}
}

module.exports = CheckoutService
