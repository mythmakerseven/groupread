const { DataTypes } = require('sequelize')
const { getPool } = require('../utils/db')

const db = getPool()

const Group = db.define('Group', {
  group_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bookName: {
    type: DataTypes.STRING(64),
    allowNull: false
  }
})

module.exports = Group