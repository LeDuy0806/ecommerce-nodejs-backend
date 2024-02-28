const envConfig = require('../configs/env.config')

const DATABASE = {
  LOCAL: `mongodb://${envConfig.db.host || 'localhost'}:${envConfig.db.port || 27017}/${
    envConfig.db.name || 'ecommerce'
  }`,
  CLOUD: `mongodb+srv://${envConfig.mongodb_cloud_username}:${envConfig.mongodb_cloud_password}@cluster0.otzjj9j.mongodb.net/`
}

const DOCUMENT_NAMES = {
  SHOP: 'Shop',
  KEY: 'Key',
  API_KEY: 'ApiKey',
  PRODUCT: 'Product'
}

const COLLECTION_NAMES = {
  SHOPS: 'Shops',
  KEYS: 'Keys',
  API_KEYS: 'ApiKeys',
  PRODUCTS: 'Products'
}

module.exports = {
  DATABASE,
  DOCUMENT_NAMES,
  COLLECTION_NAMES
}
