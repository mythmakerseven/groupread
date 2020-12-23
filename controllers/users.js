const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')
const { v4: uuidv4 } = require('uuid')

usersRouter.post('/', async (req, res) => {
  const body = req.body

  if (!body.password || body.password.length < 8) {
    return res.status(400).json({
      error: 'must include password of at least 8 characters'
    })
  }

  if (body.username.length > 32) {
    return res.status(400).json({
      error: 'username must be fewer than 32 characters'
    })
  }

  if (body.displayName && body.displayName.length > 32) {
    return res.status(400).json({
      error: 'display name must be fewer than 32 characters'
    })
  }

  if (body.email > 64) {
    return res.status(400).json({
      error: 'email must be fewer than 64 characters'
    })
  }

  const handleDisplayName = (username, displayName) => {
    if (!displayName) {
      return username
    }
    return displayName
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = User.build({
    user_id: uuidv4(),
    username: body.username,
    displayName: handleDisplayName(body.username, body.displayName),
    email: body.email,
    passwordHash
  })

  const savedUser = await user.save()

  const userForToken = {
    username: savedUser.username,
    id: savedUser.user_id
  }

  const token = jwt.sign(userForToken, config.SECRET_TOKEN_KEY)

  res
    .status(200)
    .send({ token, username: user.username, displayName: user.displayName })
})

module.exports = usersRouter