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
    type: DataTypes.STRING,
    allowNull: false
  },
  bookAuthor: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bookYear: {
    type: DataTypes.INTEGER(4),
    allowNull: true
  },
  bookIsbn: {
    type: DataTypes.STRING(13),
    allowNull: true
  }
})

module.exports = Group