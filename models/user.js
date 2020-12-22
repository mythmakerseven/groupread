const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('postgres::memory:')

const User = sequelize.define('User', {
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
  }
})

module.exports = User