// All env variables are read in this file and then imported by any module that needs them

// This file should only use standard JS features, because Webpack fetches some stuff from it
// and it doesn't understand TypeScript

require('dotenv').config()

let DB_URL = process.env.DB_URL

if (process.env.NODE_ENV === 'test') {
  DB_URL = process.env.TEST_DB_URL
}

const SECRET_TOKEN_KEY = process.env.SECRET

const PORT = process.env.PORT

module.exports = {
  DB_URL,
  SECRET_TOKEN_KEY,
  PORT
}