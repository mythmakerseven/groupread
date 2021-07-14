import config from './utils/config'
import middleware from './utils/middleware'
import express, { RequestHandler } from 'express'
import cors from 'cors'
const app = express()
import getPool from './utils/db'
import logger from './utils/logger'

import usersRouter from './controllers/users'
import groupsRouter from './controllers/groups'
import loginRouter from './controllers/login'
import postsRouter from './controllers/posts'

app.use(express.json())
app.use(cors())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor as RequestHandler)

app.use('/api/users', usersRouter)
app.use('/api/groups', groupsRouter)
app.use('/api/login', loginRouter)
app.use('/api/posts', postsRouter)

const db = getPool()

db.sync()
  .then(() => {
    logger.info(`Connected to ${config.DB_URL}`)
  })
  .catch((error: { message: string }) => {
    logger.error(`Error connecting to PostgreSQL: ${error.message}`)
  })

app.get('/health', (req, res) => {
  res.send('ok')
})

app.use('/api*', middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app