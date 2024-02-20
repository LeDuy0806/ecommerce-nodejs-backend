// require('dotenv').config()

// const envConfig = {
//   server_port: process.env.SERVER_PORT || 4000,
//   mongodb_local_host: process.env.MONGODB_LOCAL_HOST,
//   mongodb_local_port: process.env.MONGODB_LOCAL_PORT,
//   mongodb_local_db_name: process.env.MONGODB_LOCAL_DB_NAME,
//   mongodb_cloud_username: process.env.MONGODB_CLOUD_USERNAME,
//   mongodb_cloud_password: process.env.MONGODB_CLOUD_PASSWORD
// }

// module.exports = envConfig

require('dotenv').config()
const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 4000
  },
  db: {
    host: process.env.DEV_DB_HOST || '127.0.0.1',
    port: process.env.DEV_DB_PORT || '27017',
    name: process.env.DEV_DB_NAME || 'ecommerce'
  }
}

const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 4000
  },
  db: {
    host: process.env.PRO_DB_HOST || 'localhost',
    port: process.env.PRO_DB_PORT || '27017',
    name: process.env.PRO_DB_NAME || 'dbProduct'
  }
}

const envConfig = { dev, pro }
const env = process.env.NODE_ENV || 'dev'

module.exports = envConfig[env]
