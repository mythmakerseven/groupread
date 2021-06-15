import app from './app'
import http from 'http'
import config from './utils/config'
import logger from './utils/logger'
import path from 'path'

// backend handles all requests starting with /api
const server = http.createServer(app)

// other requests are routed to the /build folder
// in which the compiled frontend resides
app.get('/main.js', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'main.js'))
})

app.get('/main.css', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'main.css'))
})

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'favicon.ico'))
})

// Okay this is getting ridiculous
app.get('/f571d6d590cf815f2a7587588bf80987.webp', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'f571d6d590cf815f2a7587588bf80987.webp'))
})

app.get('/8c747e1ec6b0a8e1464fb53a4202aa62.png', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '8c747e1ec6b0a8e1464fb53a4202aa62.png'))
})

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'))
})

// TODO: this is not a good solution, we can't have a separate route for each file in /build

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})