import express from 'express'
import Post from '../models/post'
import { v4 as uuidv4 } from 'uuid'
import User from '../models/user'
import logger from '../utils/logger'
import Group from '../models/group'
import { checkToken, sanitizeUser } from './utils'
import { GroupWithMembers, RequestWithToken, UserObject } from '../utils/types'

const postsRouter = express.Router()

// Create a post
postsRouter.post('/:group', async (req: RequestWithToken, res) => {
  const body = req.body
  logger.info(`Received POST request:\n ${body}`)

  const token = req.token

  if (!body.text) {
    return res.status(400).json({ error: 'Posts cannot be empty' })
  }

  let tokenID
  try {
    tokenID = checkToken(token)
  } catch(e) {
    return res.status(400).json({ error: `${e.message}` })
  }

  const group = await Group.findOne({
    where: {
      id: req.params.group
    },
    include: [{
      model: User
    }]
  })

  if (!group) {
    return res.status(404).json({ error: 'group not found' })
  }

  const jsonGroup = group.toJSON() as GroupWithMembers

  const userObject = jsonGroup.Users.find(u => u.id === tokenID)

  if (!userObject) {
    return res.status(401).json('you are not a member of this group')
  }

  const sanitizedUser = sanitizeUser(userObject as UserObject)

  if (!body.parent && !body.title) {
    return res.status(400).json({ error: 'parent posts require a title' })
  } else if (body.parent && !body.title) {
    const parent = await Post.findOne({ where: { id: body.parent } })
    if (!parent) return res.status(400).json({ error: 'parent post not found' })
  }

  let post: Post
  if (body.parent) {
    post = Post.build({
      id: uuidv4(),
      parent: body.parent,
      text: body.text,
      createdAt: new Date(),
      updatedAt: new Date(),
      GroupId: group.id,
      UserId: sanitizedUser.id
    })
  } else {
    post = Post.build({
      id: uuidv4(),
      title: body.title,
      text: body.text,
      createdAt: new Date(),
      updatedAt: new Date(),
      GroupId: group.id,
      UserId: sanitizedUser.id
    })
  }

  // post.setAuthor(user)
  // post.addPost([ group ])
  await post.save()

  const jsonPost = post.toJSON()

  res.status(200).json({
    ...jsonPost,
    User: sanitizedUser
  })
})

// Edit a post
postsRouter.put('/edit/:id', async (req: RequestWithToken, res) => {
  // Body will include:
  // new post body = body.text

  const body = req.body
  logger.info(`Received PUT request:\n ${body}`)

  if (!body.text) {
    return res.status(400).json({ error: 'Post content cannot be empty' })
  }

  let tokenID
  try {
    tokenID = checkToken(req.token)
  } catch(e) {
    return res.status(400).json({ error: `${e.message}` })
  }

  const user = await User.findOne({ where: { id: tokenID } })
  if (!user) return res.status(400).json({ error: 'user does not exist' })

  const post = await Post.findOne({ where: { id: req.params.id } })
  if (!post) return res.status(400).json({ error: 'post does not exist' })

  if (user.id !== post.UserId) {
    return res.status(401).json({ error: 'you do not have permission to edit this post' })
  }

  // Add the new stuff
  post.text = body.text
  post.updatedAt = new Date()

  await post.save()

  const jsonPost = post.toJSON()
  const jsonUser = user.toJSON() as UserObject

  return res.status(200).json({
    ...jsonPost,
    User: sanitizeUser(jsonUser)
  })
})

export default postsRouter