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
      error: 'Passwords must be at least 8 characters'
    })
  }

  if (body.username.length > 32) {
    return res.status(400).json({
      error: 'Usernames must be fewer than 32 characters'
    })
  }

  if (body.displayName && body.displayName.length > 32) {
    return res.status(400).json({
      error: 'Display names must be fewer than 32 characters'
    })
  }

  if (body.email > 64) {
    return res.status(400).json({
      error: 'Emails must be fewer than 64 characters'
    })
  }

  const existingUser = await User.findOne({ where: { username: body.username } })
  if (existingUser) return res.status(400).json({ error: 'Username already taken' })

  // TODO: remove displayName, consider implementing on a per-group level
  // so the user can pick a group-specific display name when they join
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
    passwordHash
  })

  const savedUser = await user.save()

  const userForToken = {
    username: savedUser.username,
    id: savedUser.id
  }

  const token = jwt.sign(userForToken, config.SECRET_TOKEN_KEY)

  res
    .status(200)
    .send({ token, username: user.username, displayName: user.displayName, id: user.id })
})

// check if the token is still valid for an existing user
usersRouter.post('/validate', async (req, res) => {
  const token = req.token

  if (!token) {
    return res.status(400).json({ error: 'missing token' })
  }

  let decodedToken
  try {
    decodedToken = jwt.verify(token, config.SECRET_TOKEN_KEY)
  } catch(e) {
    if (e.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Expired token, please sign in again' })
    } else {
      return res.status(400).json({ error: 'Invalid token, please sign in again' })
    }
  }

  const tokenID = decodedToken.data.id

  if (!tokenID) {
    return res.status(401).json({ error: 'Missing token' })
  }

  const user = await User.findOne({ where: { id: tokenID } })
  if (!user) return res.status(401).json({ error: 'user does not exist' })

  res.status(200).json({ success: 'token remains valid' })
})

////////////////////////////////////////////////////////////////////////////////////////////////
// The below paths were some of the earliest ones added when I first created Groupread        //
// There is no current use for them, and re-activating them will likely require refactoring.  //
// In particular, they should require tokens and should probably be restricted to the current //
// user looking up their own info.                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////

// usersRouter.get('/:user/username', async (req, res) => {
//   const user = await User.findOne({ where: { id: req.params.user } })

//   if (!user) res.status(400).send({ error: 'invalid user id' })

//   res.status(200).send(user.username)
// })

// usersRouter.get('/:user/groups', async (req, res) => {
//   const user = await User.findOne({ where: { id: req.params.user } })

//   if (!user) res.status(400).send({ error: 'invalid user id' })

//   const groups = await user.getGroups()

//   res.status(200).send(groups)
// })

// usersRouter.get('/:user/posts', async (req, res) => {
//   const user = await User.findOne({ where: { id: req.params.user } })

//   if (!user) res.status(400).send({ error: 'invalid user id' })

//   const posts = await user.getPosts()

//   res.status(200).send(posts)
// })

module.exports = usersRouter