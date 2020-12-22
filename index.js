const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')
const path = require('path')

const server = http.createServer(app)

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})