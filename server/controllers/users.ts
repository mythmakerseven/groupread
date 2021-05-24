import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const usersRouter = require('express').Router()
import User from '../models/user'
import config from '../utils/config'
import { v4 as uuidv4 } from 'uuid'
import { checkToken } from './utils'

// Create an account
usersRouter.post('/', async (req, res) => {
  const body = req.body

  if (!body.password || body.password.length < 8) {
    return res.status(400).json({
      error: 'Passwords must be at least 8 characters'
    })
  }

  if (!body.username || body.username.length < 3 || body.username.length > 32) {
    return res.status(400).json({
      error: 'Usernames must between 3 and 32 characters'
    })
  }

  // if displayName is missing, it is automatically populated with the username
  // so we only need to validate its length if one exists in the request
  if (body.displayName && (body.displayName.length < 3 || body.displayName.length > 32)) {
    return res.status(400).json({
      error: 'Display names must be between 3 and 32 characters'
    })
  }

  if(!body.email) {
    return res.status(400).json({
      error: 'Email is required'
    })
  }

  if (body.email.length > 64) {
    return res.status(400).json({
      error: 'Emails must be fewer than 64 characters'
    })
  }

  const existingUser = await User.findOne({ where: { username: body.username } })
  if (existingUser) return res.status(400).json({ error: 'Username already taken' })

  const handleDisplayName = (username, displayName) => {
    if (!displayName) {
      return username
    }
    return displayName
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = User.build({
    id: uuidv4(),
    username: body.username,
    displayName: handleDisplayName(body.username, body.displayName),
    email: body.email,
    nameColor: '000000',
    passwordHash
  })

  const savedUser = await user.save()

  const userForToken = {
    username: savedUser.username,
    id: savedUser.id
  }

  // Tokens expire after 30 days
  const token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 720),
    data: userForToken
  }, config.SECRET_TOKEN_KEY)

  res
    .status(200)
    .send({
      token,
      username: user.username,
      displayName: user.displayName,
      id: user.id
    })
})

// Check if the token is still valid for an existing user
// The frontend hits this endpoint on first page load
usersRouter.post('/validate', async (req, res) => {
  const token = req.token

  let tokenID
  try {
    tokenID = checkToken(token)
  } catch(e) {
    return res.status(400).json({ error: `${e.message}` })
  }

  const user = await User.findOne({ where: { id: tokenID } })
  if (!user) return res.status(401).json({ error: 'user does not exist' })

  res.status(200).json({ success: 'token remains valid' })
})

export default usersRouter