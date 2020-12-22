const config = require('./utils/config')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const express = require('express')
const app = express()

const { Sequelize } = require('sequelize')
const usersRouter = require('./controllers/users')

const sequelize = new Sequelize(config.DB_NAME, config.DB_USERNAME, config.DB_PASSWORD, {
  host: config.DB_URL,
  dialect: 'postgres'
})

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/users', usersRouter)

sequelize.sync({ force: true })
  .then(() => {
    logger.info('Connected to PostgreSQL')
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