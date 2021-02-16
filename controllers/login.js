const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')

loginRouter.post('/', async (req, res) => {
  const body = req.body

  const user = await User.findOne({ where: { username: body.username } })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!user || !passwordCorrect) {
    return res.status(401).json({
      error: 'Invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  // Tokens expire after 30 days
  const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60 * 720), data: userForToken }, config.SECRET_TOKEN_KEY)

  res
    .status(200)
    .send({ token, username: user.username, displayName: user.displayName, id: user.id })
})

module.exports = loginRouter