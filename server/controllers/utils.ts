import jwt from 'jsonwebtoken'
import User from '../models/user'
import config from '../utils/config'
// import { SanitizedUser } from '../utils/types'

export const checkToken = (token: string) => {
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

  if (!decodedToken.data.id) {
    throw new Error('Missing token')
  }

  return decodedToken.data.id
}

export const sanitizeUser = (user: User) => {
  return ({
    passwordHash: undefined,
    email: undefined,
    ...user
  })
}