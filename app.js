const config = require('./utils/config')
const middleware = require('./utils/middleware')
const express = require('express')
const app = express()
const { getPool } = require('./utils/db')
const logger = require('./utils/logger')

const usersRouter = require('./controllers/users')
const groupsRouter = require('./controllers/groups')

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/users', usersRouter)
app.use('/api/groups', groupsRouter)

const db = getPool()

db.sync()
  .then(() => {
    logger.info(`Connected to ${config.DB_URL}`)
  })
  .catch((error) => {
    logger.error(`Error connecting to PostgreSQL: ${error.message}`)
  })

// Testing code for sequelize
// app.get('/', async (req, res) => {
//   try {
//     await sequelize.authenticate()
//     console.log('Connection has been established successfully.')
//   } catch (error) {
//     console.error('Unable to connect to the database:', error)
//   }

//   res.send('<h1>Hello World!</h1>')
// })

app.get('/health', (req, res) => {
  res.send('ok')
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app