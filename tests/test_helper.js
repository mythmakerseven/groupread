const Group = require('../models/group')
const User = require('../models/user')

const groupsInDb = async () => {
  return await Group.findAll()
}

const usersInDb = async () => {
  return await User.findAll()
}

const exampleUser = {
  'username': 'gruser',
  'password': 'mypassword',
  'email': 'me@mywebsite.com'
}

const exampleGroup = {
  'bookTitle': 'Gravity\'s Rainbow',
  'bookAuthor': 'Thomas Pynchon',
  'bookYear': 1973,
  'bookIsbn': '0143039946',
  'bookPageCount': 777
}

const exampleParentPost = {
  'title': 'Example post',
  'text': 'This is the text of the post',
}

// Note: needs a parent parameter for each test
const exampleReply = {
  'text': 'This is the text of the reply'
}

module.exports = {
  groupsInDb,
  usersInDb,
  exampleUser,
  exampleGroup,
  exampleParentPost,
  exampleReply
}