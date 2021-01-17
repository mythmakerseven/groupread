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
    type: DataTypes.INTEGER,
    allowNull: true // TODO: no reason for year tag, remove in next DB reset
  },
  bookIsbn: {
    type: DataTypes.STRING(13),
    allowNull: true
  },
  bookOLID: {
    type: DataTypes.STRING,
    allowNull: true // TODO: add handling for works that lack OLIDs
  }
})

module.exports = Group