const { DataTypes } = require('sequelize')
const { getPool } = require('../utils/db')

const db = getPool()

const Group = db.define('Group', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  bookTitle: {
    type: DataTypes.STRING(64),
    allowNull: false
  },
  isbn: {
    type: DataTypes.STRING(12),
    allowNull: false
  }
})

module.exports = Group