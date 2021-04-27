const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const checkToken = (token) => {
  if (!token) {
    throw new Error('Missing token')
  }

  let decodedToken
  try {
    decodedToken = jwt.verify(token, config.SECRET_TOKEN_KEY)
  } catch(e) {
    if (e.name === 'TokenExpiredError') {
      throw new Error('Expired token, please sign in again')
    } else {
      throw new Error('Invalid token')
    }
  }

  const tokenID = decodedToken.data.id

  if (!tokenID) {
    throw new Error('Missing token')
  }

  return tokenID
}

module.exports = {
  checkToken
}