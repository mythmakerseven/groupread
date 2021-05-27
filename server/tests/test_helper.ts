import Group from '../models/group'
import Post from '../models/post'
import User from '../models/user'
import { ReplyObject } from '../utils/types'

const groupsInDb = async (): Promise<Group[]> => {
  return await Group.findAll()
}

const usersInDb = async (): Promise<User[]> => {
  return await User.findAll()
}

const postsInDb = async (): Promise<Post[]> => {
  return await Post.findAll()
}

const searchUsers = async (id: string): Promise<User> => {
  const res = await User.findOne({ where: { id: id } })
  return res
}

const searchPosts = async (id: string): Promise<Post> => {
  const res = await Post.findOne({ where: { id: id } })
  return res
}

const exampleUser = {
  'username': 'gruser',
  'displayName': 'Groupread User',
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

const exampleReply = (parentId: string): ReplyObject => (
  {
    'parent': parentId,
    'text': 'This is the text of the reply'
  }
)

// They will all be numbers, but it is a string
const getRandomString = (): string => {
  return `${Math.random().toString().substr(2, 8)}${Math.random().toString().substr(2, 8)}`
}

export {
  groupsInDb,
  usersInDb,
  postsInDb,
  searchUsers,
  searchPosts,
  exampleUser,
  exampleGroup,
  exampleParentPost,
  exampleReply,
  getRandomString
}