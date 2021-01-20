const config = require('./utils/config')
const middleware = require('./utils/middleware')
const express = require('express')
const cors = require('cors')
const app = express()
const { getPool } = require('./utils/db')
const logger = require('./utils/logger')

const usersRouter = require('./controllers/users')
const groupsRouter = require('./controllers/groups')
const loginRouter = require('./controllers/login')
const postsRouter = require('./controllers/posts')

app.use(express.json())
app.use(cors())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/users', usersRouter)
app.use('/api/groups', groupsRouter)
app.use('/api/login', loginRouter)
app.use('/api/posts', postsRouter)

const db = getPool()

db.sync()
  .then(() => {
    logger.info(`Connected to ${config.DB_URL}`)
  })
  .catch((error) => {
    logger.error(`Error connecting to PostgreSQL: ${error.message}`)
  })

app.get('/health', (req, res) => {
  res.send('ok')
})

app.use('/api', middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app