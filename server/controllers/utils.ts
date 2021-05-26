import jwt from 'jsonwebtoken'
import User from '../models/user'
import Group from '../models/group'
import config from '../utils/config'

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

export const getCurrentUserInfo = async (id: string, tokenID: string) => {
  const user = await User.findOne({
    where: {
      id
    },
    include: {
      model: Group,
      through: { attributes: [] }
    }
  })

  // Parse the response as JSON because the Sequelize model includes a bunch of metadata junk
  const userObject: User = user.toJSON() as User

  if (!userObject) {
    throw ({
      status: 401,
      message: 'user does not exist'
    })
  }

  if (userObject.id !== tokenID) {
    throw {
      status: 400,
      message: 'you do not have permission to this account\'s private info'
    }
  }

  return userObject
}