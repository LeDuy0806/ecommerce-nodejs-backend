const app = require('./src/app')

const PORT = require('./src/configs/env.config').server_port || 4000

const server = app.listen(PORT, () => {
  console.log(`Web Server Ecommerce is listening on port ${PORT}`)
})

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed')
  })
})
