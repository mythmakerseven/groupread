import app from './app'
import http from 'http'
import config from './utils/config'
import logger from './utils/logger'
import path from 'path'
import fs from 'fs'

// backend handles all requests starting with /api
const server = http.createServer(app)
// now let's handle everything else

// get a list of files in /build
const staticFolder = path.join(__dirname, '..')
const staticFiles = fs.readdirSync(staticFolder)

app.get('/:path', (req, res) => {
  if (staticFiles.includes(req.params.path)) {
    return res.sendFile(path.join(staticFolder, req.params.path))
  } else {
    return res.sendFile(path.join(staticFolder, 'index.html'))
  }
})

// Groupread uses react-router, so we need to redirect direct
// links to index.html and then react-router can handle the URL
app.get('/*', (req, res) => {
  return res.sendFile(path.join(staticFolder, 'index.html'))
})

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})