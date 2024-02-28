const express = require('express')
const productController = require('../../controllers/product.controller')
const router = express.Router()

const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication } = require('../../utils/auth.util')

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))
router.get('/all', asyncHandler(productController.findAllProducts))
router.get('/:id', asyncHandler(productController.findProduct))

//authentications
router.use(authentication)
///////////////////////

router.post('/', asyncHandler(productController.createProduct))
router.patch('/:id', asyncHandler(productController.updateProduct))

// PUT
router.put('/publish/:id', asyncHandler(productController.publishProductByShop))
router.put('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))

// QUERY
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/publish/all', asyncHandler(productController.getAllPublishForShop))

module.exports = router
