// All env variables are read in this file and then imported by any module that needs them

// This file should only use standard JS features, because Webpack fetches some stuff from it
// and it doesn't understand TypeScript

require('dotenv').config()

if (!process.env.DB_URL) {
  throw new Error('Missing database URL, please add to env')
}

let DB_URL = process.env.DB_URL

if (process.env.NODE_ENV === 'test') {
  DB_URL = process.env.TEST_DB_URL
}

if (!process.env.SECRET) {
  throw new Error('Missing secret token key, please add to env')
}

const SECRET_TOKEN_KEY = process.env.SECRET

const PORT = process.env.PORT

module.exports = {
  DB_URL,
  SECRET_TOKEN_KEY,
  PORT
}