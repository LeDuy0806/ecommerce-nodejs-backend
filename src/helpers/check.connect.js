'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')

const _SECONDS = 5000

// Count number of connections to MongoDB function
const countConnect = () => {
  const numConnnection = mongoose.connections.length
  console.log(`Number of connections::${numConnnection}`)
}

// Check overload connections to MongoDB function
const checkOverload = () => {
  setInterval(() => {
    const numConnnection = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss

    const maxConnections = numCores * 5

    console.log(`Active connections::${numConnnection}`)
    console.log(`Memory usage::${memoryUsage / 1024 / 1024} Mb`)

    if (numConnnection > maxConnections) {
      console.log('Connection overload detected!')
      console.log(`Overload connections::${maxConnections - numConnnection}`)
      console.log(`Max connections::${maxConnections}`)
    }
  }, _SECONDS) // Monitor every 5 seconds
}

module.exports = {
  countConnect,
  checkOverload
}
