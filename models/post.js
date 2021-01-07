const { DataTypes, Sequelize } = require('sequelize')
const { getPool } = require('../utils/db')
const Group = require('./group')
const User = require('./user')

const db = getPool()

const Post = db.define('Post', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
})

Post.belongsToOne(Group, { through: 'GroupPosts' })
Post.belongsToOne(User, { through: 'UserPosts' })

module.exports = Post