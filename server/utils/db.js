const { Sequelize } = require('sequelize')
const config = require('./config')

let sequelize

module.exports = {
  getPool: () => {
    if (sequelize) return sequelize
    sequelize = new Sequelize(config.DB_URL)
    return sequelize
  }
}