const { DataTypes } = require('sequelize')
const { getPool } = require('../utils/db')
const Group = require('./group')

const db = getPool()

const User = db.define('User', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
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
  }
})

User.belongsToMany(Group, { through: 'UserGroups' })
Group.belongsToMany(User, { through: 'UserGroups' })

// add admin id to group
User.hasMany(Group, {
  foreignKey: {
    name: 'AdminId'
  },
  as: 'admin'
})

module.exports = User