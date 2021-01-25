const Group = require('../models/group')
const User = require('../models/user')

const groupsInDb = async () => {
  return await Group.findAll()
}

const usersInDb = async () => {
  return await User.findAll()
}

module.exports = {
  groupsInDb,
  usersInDb
}