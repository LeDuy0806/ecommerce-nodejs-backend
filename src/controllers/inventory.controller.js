const InventoryService = require('../services/inventory.service')

class inventoryController {
  addStockToInventory = async (req, res, next) => {
    new SuccessResponse({
      message: 'Add stock to inventory successfully',
      metaData: await InventoryService.addStockToInventory(req.body)
    }).send(res)
  }
}

module.exports = new inventoryController()
