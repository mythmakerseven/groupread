const groupsRouter = require('express').Router()
const Group = require('../models/group')
const { v4: uuidv4 } = require('uuid')
const User = require('../models/user')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')

groupsRouter.get('/:id/members', async (req, res) => {
  const group = await Group.findOne({ where: { id: req.params.id } })

  if (!group) res.status(400).send({ error: 'invalid group id' })

  const users = await group.getUsers()

  res.status(200).send(users)
})

groupsRouter.post('/', async (req, res) => {
  const body = req.body
  logger.info(`Received POST request:\n ${body}`)

  const handleGroupName = (bookName, groupName) => {
    if (!groupName) {
      return bookName
    }
    return groupName
  }

  const group = Group.build({
    id: uuidv4(),
    bookName: body.bookName,
    groupName: handleGroupName(body.bookName, body.groupName)
  })

  await group.save()

  res
    .status(200)
    .send({ id: group.id, bookName: group.bookName })
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

  res.status(200).send({ success: `Added ${user.username} to group ${group.bookName} (${group.id})` })
})

module.exports = groupsRouter