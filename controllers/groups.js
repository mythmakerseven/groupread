const groupsRouter = require('express').Router()
const Group = require('../models/group')
const { v4: uuidv4 } = require('uuid')
const User = require('../models/user')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')

groupsRouter.get('/all', async (req, res) => {
  const groups = await Group.findAll()

  return res.status(200).json(groups)
})

groupsRouter.get('/:id', async (req, res) => {
  const group = await Group.findOne({ where: { id: req.params.id } })

  if (!group) return res.status(400).json({ error: 'invalid group id' })

  return res.status(200).json(group)
})

groupsRouter.get('/:id/members', async (req, res) => {
  const group = await Group.findOne({ where: { id: req.params.id } })

  if (!group) return res.status(400).json({ error: 'invalid group id' })

  const users = await group.getUsers()

  return res.status(200).json(users)
})

groupsRouter.get('/:id/posts', async (req, res) => {
  const group = await Group.findOne({ where: { id: req.params.id } })

  if (!group) return res.status(400).json({ error: 'invalid group id' })

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
  return res.status(200).json(sortedPosts)
})

groupsRouter.post('/', async (req, res) => {
  // TODO: user authentication for group creation

  const body = req.body
  logger.info(`Received POST request:\n ${body}`)

  // ISBNs are comprised of numbers, except for the final digit which can be an X.
  // They are either 10 or 13 digits.
  if (body.bookIsbn) {
    const isbn = body.bookIsbn
    if (isbn.length !== 10 && isbn.length !== 13) {
      return res
        .status(400)
        .json({ error: 'ISBN must be 10 or 13 characters' })
    }

    if (isNaN(Number(isbn.slice(0, -2))) || (isNaN(Number(isbn.slice(-1))) && isbn.charAt(isbn.length - 1) !== 'X' )) {
      return res
        .status(400)
        .json({ error: 'Invalid ISBN' })
    }
  }

  const year = body.bookYear
  // years must be 4 digits - maybe an issue for edge cases of ancient books
  if (year && (year.length !== 4 || isNaN(Number(year)))) {
    return res
      .status(400)
      .json({ error: 'Invalid year' })
  }

  if (!body.bookTitle) {
    return res
      .status(400)
      .json({ error: 'Title is required' })
  }

  const group = await Group.build({
    id: uuidv4(),
    bookTitle: body.bookTitle,
    bookAuthor: body.bookAuthor ? body.bookAuthor : null,
    bookYear: body.bookYear ? Number(body.bookYear) : null,
    bookIsbn: body.bookIsbn,
    bookOLID: body.bookOLID ? body.bookOLID : null
  })

  await group.save()

  res
    .status(200)
    .json(group)
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

  if (!user) return res.status(400).json({ error: 'user not found' })
  if (!group) return res.status(400).json({ error: 'group not found' })

  user.addGroup(group)

  res.status(200).json({ success: `Added ${user.username} to group ${group.id}` })
})

module.exports = groupsRouter