class inventoryController {
  async getInventory(req, res, next) {
    try {
      const inventory = await inventoryService.getInventory()
      res.status(200).json(inventory)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new inventoryController()
