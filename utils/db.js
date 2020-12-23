const { Sequelize } = require('sequelize')
const config = require('./config')

let sequelize

module.exports = {
  getPool: function () {
    if (sequelize) return sequelize
    sequelize = new Sequelize(config.DB_NAME, config.DB_USERNAME, config.DB_PASSWORD, {
      host: config.DB_URL,
      dialect: 'postgres'
    })
    return sequelize
  }
}