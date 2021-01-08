const { DataTypes } = require('sequelize')
const { getPool } = require('../utils/db')

const db = getPool()

const Group = db.define('Group', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  bookName: {
    type: DataTypes.STRING(64),
    allowNull: false
  },
  // TODO: remove groupName next time dev database is reset
  groupName: {
    type: DataTypes.STRING(64),
    allowNull: false
  }
})

module.exports = Group