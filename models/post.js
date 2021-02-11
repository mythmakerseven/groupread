const { DataTypes } = require('sequelize')
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
  parent: {
    type: DataTypes.STRING,
    allowNull: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
})

Post.belongsTo(Group)
Group.hasMany(Post)

Post.belongsTo(User)
User.hasMany(Post)

module.exports = Post