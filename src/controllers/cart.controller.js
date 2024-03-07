'use strict'

const { SuccessResponse } = require('../core/success.response')
const cartService = require('../services/cart.service')

class CartController {
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Product added to cart successfully',
      metaData: await cartService.addToCart(req.body)
    }).send(res)
  }
  updateCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Cart updated successfully',
      metaData: await cartService.addToCartV2(req.body)
    }).send(res)
  }
  deleteCartItem = async (req, res, next) => {
    new SuccessResponse({
      message: 'Cart deleted successfully',
      metaData: await cartService.deleteUserCart(req.body)
    }).send(res)
  }

  listToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'List cart',
      metaData: await cartService.getListUserCart(req.query)
    }).send(res)
  }
}

module.exports = new CartController()
