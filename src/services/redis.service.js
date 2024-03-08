'use strict'

const redis = require('redis')

const redisClient = redis.createClient()

const pexpire = promisify(redisClient.pExpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`
  const retrytimes = 10
  const expireTime = 3000

  for (let i = 0; i < retrytimes; i++) {
    const result = await setnxAsync(key, expireTime)
    console.log('result:::', result)
    if (result === 1) {
      const isReversation = await reservationInventory({ productId, quantity, cartId })
      if (isReversation.modifiedCount) {
        await pexpire(key, expireTime)
        return key
      }
      return null
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
}

const releaseLock = async (keyLock) => {
  const delAsyncKey = promify(redisClient.del).bind(redisClient)
  return await delAsyncKey(keyLock)
}

module.exports = {
  acquireLock,
  releaseLock
}
