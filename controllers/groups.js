const groupsRouter = require('express').Router()
const Group = require('../models/group')
const { v4: uuidv4 } = require('uuid')
const User = require('../models/user')

groupsRouter.post('/', async (req, res) => {
  const body = req.body
  console.log(body)

  const handleGroupName = (bookName, groupName) => {
    if (!groupName) {
      return bookName
    }
    return groupName
  }

  const group = Group.build({
    group_id: uuidv4(),
    bookName: body.bookName,
    groupName: handleGroupName(body.bookName, body.groupName)
  })

  await group.save()

  res
    .status(200)
    .send({ group_id: group.group_id, bookName: group.bookName })
})

groupsRouter.post('/join/:group/:user', async (req, res) => {
  const user = await User.findOne({ where: { user_id: req.params.user } })
  const group = await Group.findOne({ where: { group_id: req.params.group } })

  if (!user) return res.status(400).send({ error: 'user not found' })
  if (!group) return res.status(400).send({ error: 'group not found' })

  user.addGroup(group)

  res.status(200).send({ success: `Added ${user.username} (${user.user_id}) to group ${group.bookName} (${group.group_id})` })
})

module.exports = groupsRouter