const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')
const path = require('path')

// backend handles all requests starting with /api
const server = http.createServer(app)

// other requests are routed to the /build folder
// in which the compiled frontend resides
app.get('/main.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'main.js'))
})

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'favicon.ico'))
})

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// TODO: this is not a good solution, we can't have a separate route for each file in /build

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})