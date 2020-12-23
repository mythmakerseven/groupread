const groupsRouter = require('express').Router()
const Group = require('../models/group')
const { v4: uuidv4 } = require('uuid')

groupsRouter.post('/', async (req, res) => {
  const body = req.body
  console.log(body)

  const group = Group.build({
    group_id: uuidv4(),
    bookName: body.bookName
  })

  await group.save()

  res
    .status(200)
    .send({ group_id: group.group_id, bookName: group.bookName })
})

module.exports = groupsRouter