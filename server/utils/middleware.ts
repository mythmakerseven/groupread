import express from 'express'
import logger from './logger'
import { RequestWithToken } from './types'

interface LoggerObject {
  method: string,
  path: string,
  body: {data: unknown}
}

interface ErrorMessage {
  name: string,
  message: string
}

const requestLogger = (req: LoggerObject, _res: express.Response, next: () => void): void => {
  logger.info(`Method: ${req.method}`)
  logger.info(`Path: ${req.path}`)
  logger.info(`Body: ${req.body}`)
  logger.info('---')
  next()
}

const tokenExtractor = (req: RequestWithToken, _res: express.Response, next: () => void): void => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
  } else {
    req.token = null
  }
  next()
}

const unknownEndpoint = (_req: express.Request, res: express.Response): void => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error: ErrorMessage, _req: express.Request, res: express.Response, next: (arg0: ErrorMessage) => void): express.Response | void => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

export default {
  requestLogger,
  tokenExtractor,
  unknownEndpoint,
  errorHandler
}