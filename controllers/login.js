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

  // TODO: make tokens more secure (expiration, encryption, etc)
  // see https://gist.github.com/soulmachine/b368ce7292ddd7f91c15accccc02b8df
  const token = jwt.sign(userForToken, config.SECRET_TOKEN_KEY)

  res
    .status(200)
    .send({ token, username: user.username, displayName: user.displayName, id: user.id })
})

module.exports = loginRouter