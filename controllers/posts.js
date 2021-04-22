const postsRouter = require('express').Router()
const config = require('../utils/config')
const Post = require('../models/post')
const { v4: uuidv4 } = require('uuid')
const User = require('../models/user')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')
const Group = require('../models/group')

// TODO: make a validateToken utility function for less repetition
// Could be used across controllers

// Create a post
postsRouter.post('/:group', async (req, res) => {
  const body = req.body
  logger.info(`Received POST request:\n ${body}`)

  const token = req.token
  if (!token) {
    return res.status(401).json({ error: 'missing token' })
  }

  if (!body.text) {
    return res.status(400).json({ error: 'Posts cannot be empty' })
  }

  let decodedToken
  try {
    decodedToken = jwt.verify(token, config.SECRET_TOKEN_KEY)
  } catch(e) {
    if (e.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Expired token, please sign in again' })
    } else {
      return res.status(400).json({ error: 'Invalid token, please sign in again' })
    }
  }

  const tokenID = decodedToken.data.id

  if (!tokenID) {
    return res.status(401).json({ error: 'Missing token' })
  }

  // Three queries here - maybe these could be refactored as one,
  // e.g. by querying for the user-group relationship.
  // This would make the errors more generic, which may be a downside.
  const user = await User.findOne({ where: { id: tokenID } })
  if (!user) return res.status(401).json({ error: 'user does not exist' })

  const group = await Group.findOne({ where: { id: req.params.group } })
  if (!group) return res.status(400).json({ error: 'group does not exist' })

  const groupMemberData = await group.getUsers()
  const memberIDs = groupMemberData.map(u => u.dataValues.id)

  if (!memberIDs.includes(user.id)) {
    return res.status(401).json({ error: 'you are not a member of this group' })
  }

  if (!body.parent && !body.title) {
    return res.status(400).json({ error: 'parent posts require a title' })
  } else if (body.parent && !body.title) {
    const parent = await Post.findOne({ where: { id: body.parent } })
    if (!parent) return res.status(400).json({ error: 'parent post not found' })
  }

  let post
  if (body.parent) {
    post = await Post.build({
      id: uuidv4(),
      parent: body.parent,
      text: body.text,
      createdAt: new Date(),
      updatedAt: new Date(),
      GroupId: group.id,
      UserId: user.id
    })
  } else {
    post = await Post.build({
      id: uuidv4(),
      title: body.title,
      text: body.text,
      createdAt: new Date(),
      updatedAt: new Date(),
      GroupId: group.id,
      UserId: user.id
    })
  }

  await post.save()

  res.status(200).send(post)
})

// Edit a post
postsRouter.put('/edit/:id', async (req, res) => {
  // Body will include:
  // new post body = body.text

  const body = req.body
  logger.info(`Received PUT request:\n ${body}`)

  const token = req.token
  if (!token) {
    return res.status(401).json({ error: 'missing token' })
  }

  if (!body.text) {
    return res.status(400).json({ error: 'Post content cannot be empty' })
  }

  let decodedToken
  try {
    decodedToken = jwt.verify(token, config.SECRET_TOKEN_KEY)
  } catch(e) {
    if (e.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Expired token, please sign in again' })
    } else {
      return res.status(400).json({ error: 'Invalid token, please sign in again' })
    }
  }

  const tokenID = decodedToken.data.id

  if (!tokenID) {
    return res.status(401).json({ error: 'Missing token' })
  }

  const user = await User.findOne({ where: { id: tokenID } })
  if (!user) return res.status(400).json({ error: 'user does not exist' })

  let post = await Post.findOne({ where: { id: req.params.id } })
  if (!post) return res.status(400).json({ error: 'post does not exist' })

  if (user.id !== post.UserId) return res.status(401).json({ error: 'you do not have permission to edit this post' })

  // Add the new stuff
  post.text = body.text
  post.updatedAt = new Date()

  await post.save()
  res.status(200).send(post)
})

module.exports = postsRouter