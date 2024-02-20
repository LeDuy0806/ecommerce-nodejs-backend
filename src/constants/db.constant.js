const envConfig = require('../configs/env.config')

const DATABASE = {
  LOCAL: `mongodb://${envConfig.db.host || 'localhost'}:${envConfig.mongodb_local_port || 27017}/${
    envConfig.mongodb_local_db_name || 'ecommerce'
  }`,
  CLOUD: `mongodb+srv://${envConfig.mongodb_cloud_username}:${envConfig.mongodb_cloud_password}@cluster0.otzjj9j.mongodb.net/`
}

const DOCUMENT_NAMES = {
  SHOP: 'Shop',
  KEY: 'Key',
  API_KEY: 'ApiKey'
}

const COLLECTION_NAMES = {
  SHOPS: 'Shops',
  KEYS: 'Keys',
  API_KEYS: 'ApiKeys'
}

module.exports = {
  DATABASE,
  DOCUMENT_NAMES,
  COLLECTION_NAMES
}
