const groupsRouter = require('express').Router()
const Group = require('../models/group')
const { v4: uuidv4 } = require('uuid')
const User = require('../models/user')
const logger = require('../utils/logger')

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

groupsRouter.post('/join/:group/:user', async (req, res) => {
  const user = await User.findOne({ where: { id: req.params.user } })
  const group = await Group.findOne({ where: { id: req.params.group } })

  if (!user) return res.status(400).send({ error: 'user not found' })
  if (!group) return res.status(400).send({ error: 'group not found' })

  user.addGroup(group)

  res.status(200).send({ success: `Added ${user.username} (${user.id}) to group ${group.bookName} (${group.id})` })
})

module.exports = groupsRouter