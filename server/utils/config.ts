// All env variables are read in this file and then imported by any module that needs them

import dotenv from 'dotenv'
import logger from './logger'

dotenv.config()

// TypeScript complains about the possibility of this being undefined.
// If no DB URL is provided, the empty string will be returned and
// Sequelize will error out on its own. Manually writing null-checking
// here caused problems for tests.
let DB_URL = process.env.DB_URL || ''

if (process.env.NODE_ENV === 'test') {
  logger.info('Running in test mode')
  DB_URL = process.env.TEST_DB_URL || ''
}

if (!process.env.SECRET) {
  throw new Error('Missing secret token key, please add to env')
}
const SECRET_TOKEN_KEY = process.env.SECRET

const PORT = process.env.PORT

export default {
  DB_URL,
  SECRET_TOKEN_KEY,
  PORT
}