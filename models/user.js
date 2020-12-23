const { DataTypes } = require('sequelize')
const { getPool } = require('../utils/db')
const Group = require('./group')

const db = getPool()

const User = db.define('User', {
  user_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(32),
    allowNull: false
  },
  displayName: {
    type: DataTypes.STRING(32),
    allowNull: false
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(64),
    allowNull: false
  },
  nameColor: {
    type: DataTypes.STRING(6),
    allowNull: false,
    defaultValue: '000000'
  },
  groups: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  }
})

User.belongsToMany(Group, { through: 'UserGroups' })

module.exports = User