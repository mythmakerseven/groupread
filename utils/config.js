// All env variables are read in this file and then imported by any module that needs them

require('dotenv').config()

const DB_URL = process.env.DB_URL

const DB_USERNAME = process.env.DB_USERNAME

const DB_PASSWORD = process.env.DB_PASSWORD

const DB_NAME = process.env.DB_NAME

const SECRET_TOKEN_KEY = process.env.SECRET

const PORT = process.env.PORT

module.exports = {
  DB_URL,
  SECRET_TOKEN_KEY,
  PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME
}