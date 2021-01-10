const groupsRouter = require('express').Router()
const Group = require('../models/group')
const { v4: uuidv4 } = require('uuid')
const User = require('../models/user')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')

groupsRouter.get('/all', async (req, res) => {
  const groups = await Group.findAll()

  res.status(200).send(groups)
})

groupsRouter.get('/:id', async (req, res) => {
  const group = await Group.findOne({ where: { id: req.params.id } })

  if (!group) res.status(400).send({ error: 'invalid group id' })

  res.status(200).send(group)
})

groupsRouter.get('/:id/members', async (req, res) => {
  const group = await Group.findOne({ where: { id: req.params.id } })

  if (!group) res.status(400).send({ error: 'invalid group id' })

  const users = await group.getUsers()

  res.status(200).send(users)
})

groupsRouter.get('/:id/posts', async (req, res) => {
  const group = await Group.findOne({ where: { id: req.params.id } })

  if (!group) res.status(400).send({ error: 'invalid group id' })

  const posts = await group.getPosts()

  const sortPosts = posts => {
    const parentPosts = posts.filter(post => !post.parent)

    // Prior to refactor (when this function returned a simple array of posts),
    // we didn't need this weird hack to unpack the dataValues field.
    // No idea why it suddenly formats the parentPosts (and ONLY those) that way,
    // but this workaround works!
    const sortedPosts = parentPosts.map(post => post = { ...post.dataValues, replies: posts.filter(childPost => childPost.parent === post.id) } )
    return sortedPosts
  }

  const sortedPosts = await sortPosts(posts)
  res.status(200).send(sortedPosts)
})

groupsRouter.post('/', async (req, res) => {
  const body = req.body
  logger.info(`Received POST request:\n ${body}`)

  const group = Group.build({
    id: uuidv4(),
    bookTitle: body.bookTitle,
    isbn: body.isbn
  })

  // TODO: strip all non-number chars from isbn

  await group.save()

  res
    .status(200)
    .send({ id: group.id, bookTitle: group.bookTitle, isbn: group.isbn })
})

groupsRouter.post('/join/:group', async (req, res) => {
  console.log(req)
  const token = req.token

  if (!token) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  let decodedToken
  try {
    decodedToken = jwt.verify(token, process.env.SECRET)
  } catch {
    return res.status(400).json({ error: 'invalid token' })
  }

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'missing token' })
  }

  const user = await User.findOne({ where: { id: decodedToken.id } })
  const group = await Group.findOne({ where: { id: req.params.group } })

  if (!user) return res.status(400).send({ error: 'user not found' })
  if (!group) return res.status(400).send({ error: 'group not found' })

  user.addGroup(group)

  res.status(200).send({ success: `Added ${user.username} to group ${group.id}` })
})

module.exports = groupsRouter