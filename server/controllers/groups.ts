const groupsRouter = require('express').Router()
import Group from '../models/group'
import { v4 as uuidv4 } from 'uuid'
import User from '../models/user'
import logger from '../utils/logger'
import Post from '../models/post'
import { checkToken, sanitizeUser } from './utils'

// utility function for returning all posts, properly sorted by parent/child
const sortPosts = posts => {
  const parentPosts = posts.filter(post => !post.parent)

  // Sort the posts into a hierarchical object with replies as children, etc
  const sortedPosts = parentPosts.map(post => post = { ...post.dataValues, replies: posts.filter(childPost => childPost.parent === post.id) } )
  return sortedPosts
}

// Get list of groups
groupsRouter.get('/all', async (req, res) => {
  const groups = await Group.findAll()

  return res.status(200).json(groups)
})

// Get details of one group
groupsRouter.get('/:id', async (req, res) => {
  const group = await Group.findOne({ where: { id: req.params.id } })

  if (!group) return res.status(400).json({ error: 'invalid group id' })
  return res.status(200).json(group)
})

// Get members of a group
groupsRouter.get('/:id/members', async (req, res) => {
  const group = await Group.findOne({ where: { id: req.params.id } })

  if (!group) return res.status(400).json({ error: 'invalid group id' })

  // Use the raw option to avoid Sequelize's goofy object format that makes it
  // hard to run the sanitize function later.
  // The nest option prevents the raw option from flattening the data, which breaks
  // stuff on the frontend.
  const users = await group.getUsers({ raw: true, nest: true })

  // Make sure to sanitize to remove password hash and email
  return res.status(200).json(users.map(u => sanitizeUser(u)))
})

// Get posts from a group
groupsRouter.get('/:id/posts', async (req, res) => {
  const group = await Group.findOne({ where: { id: req.params.id } })

  if (!group) return res.status(400).json({ error: 'invalid group id' })

  const posts = await group.getPosts()

  const sortedPosts = await sortPosts(posts)

  // excluded scheduled posts which have future createdAt dates
  const sortedPastPosts = sortedPosts.filter(p => p.createdAt <= new Date())
  return res.status(200).json(sortedPastPosts)
})

// Create a group
groupsRouter.post('/', async (req, res) => {
  const token = req.token
  const body = req.body

  logger.info(`Received POST request:\n ${body}`)

  let tokenID
  try {
    tokenID = checkToken(token)
  } catch(e) {
    return res.status(400).json({ error: `${e.message}` })
  }

  const user = await User.findOne({ where: { id: tokenID } })
  if (!user) return res.status(401).json({ error: 'user does not exist' })

  // ISBNs are comprised of numbers, except for the final digit which can be an X.
  // They are either 10 or 13 digits.
  if (body.bookIsbn) {
    const isbn = body.bookIsbn
    if (isbn.length !== 10 && isbn.length !== 13) {
      return res
        .status(400)
        .json({ error: 'ISBN must be 10 or 13 characters' })
    }

    // Ugly way to make sure every char is a number except for the possible trailing X
    if (!Number.isInteger(Number(isbn.slice(0, -2))) || (!Number.isInteger(Number(isbn.slice(-1))) && isbn.charAt(isbn.length - 1) !== 'X' )) {
      return res
        .status(400)
        .json({ error: 'Invalid ISBN' })
    }
  }

  const year = body.bookYear
  // years must be 4 digits - maybe an issue for edge cases of ancient books
  if (year && (year.toString().length !== 4 || !Number.isInteger(year))) {
    return res
      .status(400)
      .json({ error: 'Invalid year' })
  }

  if (!body.bookTitle) {
    return res
      .status(400)
      .json({ error: 'Title is required' })
  }

  if (!body.bookPageCount) {
    return res
      .status(400)
      .json({ error: 'Page count is required' })
  }

  if (!Number.isInteger(body.bookPageCount)) {
    return res
      .status(400)
      .json({ error: 'Page count must be a number' })
  }

  const group = await Group.create({
    id: uuidv4(),
    bookTitle: body.bookTitle,
    bookAuthor: body.bookAuthor ? body.bookAuthor : null,
    bookYear: body.bookYear ? Number(body.bookYear) : null,
    bookIsbn: body.bookIsbn,
    bookOLID: body.bookOLID ? body.bookOLID : null,
    bookPageCount: Number(body.bookPageCount),
    AdminId: user.id
  })

  // Add user to group
  await user.addGroup([ group.id ])

  res.status(200).json(group)
})

// Join a group
groupsRouter.post('/join/:group', async (req, res) => {
  const token = req.token

  let tokenID
  try {
    tokenID = checkToken(token)
  } catch(e) {
    return res.status(400).json({ error: `${e.message}` })
  }

  const user = await User.findOne({ where: { id: tokenID } })
  if (!user) return res.status(400).json({ error: 'user not found' })
  const group = await Group.findOne({ where: { id: req.params.group } })
  if (!group) return res.status(400).json({ error: 'group not found' })

  await user.addGroup([ group.id ])

  // remove password info and username from public user list

  res.status(200).json({ user: sanitizeUser(user), groupID: group.id })
})

// Schedule posts for a group
// Auto-populates the list of posts with future weekly threads
groupsRouter.post('/schedule/:group', async (req, res) => {
  // request schema:
  // {
  //   1: 50
  //   2: 100
  // }
  const token = req.token

  let tokenID
  try {
    tokenID = checkToken(token)
  } catch(e) {
    return res.status(400).json({ error: `${e.message}` })
  }

  const group = await Group.findOne({ where: { id: req.params.group } })
  const user = await User.findOne({ where: { id: tokenID } })

  if (!group) {
    return res.status(400).json({ error: 'group not found' })
  }

  if (!user) {
    return res.status(400).json({ error: 'user not found' })
  }

  const calculateDate = weekNumber => {
    const currentDate = new Date()
    // decrease weekNumber by one so Week 1 starts immediately
    currentDate.setDate(currentDate.getDate() + ((weekNumber - 1) * 7) )
    return currentDate
  }

  const weeks = req.body

  if (!weeks) {
    return res.status(400).json({ error: 'Schedule is in an improper format' })
  }

  if (weeks.length < 1 || weeks.length > 26) {
    return res.status(400).json({ error: 'Schedule must have between 1 and 26 weeks' })
  }

  const findLastWeeksPage = week => {
    if (parseInt(week) === 1) {
      return 1
    }
    const page = parseInt(weeks[week - 1]) + 1
    return page
  }

  const weekNumbers = Object.keys(weeks)
  for (let i = 1; i < weekNumbers.length + 1; i++) {
    // validate week list to make sure it's a sequential list of numbers
    if (i !== parseInt(weekNumbers[i-1])) {
      return res.status(400).json({ error: 'Schedule is in improper format' })
    }
    // make sure page numbers are sequential
    if ((weeks[i] - findLastWeeksPage(weekNumbers[i-1])) < 0) {
      return res.status(400).json({ error: 'Page numbers are not in order' })
    }
  }

  if (parseInt(weeks[weekNumbers.length]) !== group.bookPageCount) {
    return res.status(400).json({ error: 'Schedule must end on the last page of the book' })
  }

  const postsToSchedule = []

  Object.keys(weeks).forEach(week => {
    const weekPost = {
      id: uuidv4(),
      title: `Weekly post for pages ${findLastWeeksPage(week)}-${parseInt(weeks[week])}`,
      text: `This is the auto-generated weekly discussion thread for week ${week}, covering pages ${findLastWeeksPage(week)}-${weeks[week]}.`,
      createdAt: calculateDate(parseInt(week)),
      updatedAt: calculateDate(parseInt(week)),
      UserId: user.id,
      GroupId: group.id
    }

    postsToSchedule.push(weekPost)
  })

  await Post.bulkCreate(postsToSchedule)

  const posts = await group.getPosts()
  const sortedPosts = await sortPosts(posts)
  return res.status(200).json(sortedPosts)
})

export default groupsRouter