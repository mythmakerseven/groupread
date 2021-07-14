import jwt from 'jsonwebtoken'
import User from '../models/user'
import Group from '../models/group'
import config from '../utils/config'
import { SanitizedUser, UserObject, PostObject } from '../utils/types'

export const checkToken = (token: string | undefined): string => {
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

  if (typeof decodedToken === 'string' || !decodedToken.data.id) {
    throw new Error('Missing or invalid token')
  }

  return decodedToken.data.id
}

export const sanitizeUser = (user: UserObject): SanitizedUser => {
  const sanitizedUser = { ...user, passwordHash: undefined, email: undefined }
  return sanitizedUser
}

export const getCurrentUserInfo = async (id: string, tokenID: string): Promise<User> => {
  const user = await User.findOne({
    where: {
      id
    },
    include: {
      model: Group,
      through: { attributes: [] }
    }
  })

  if (!user) {
    throw ({
      status: 401,
      message: 'user does not exist'
    })
  }

  // Parse the response as JSON because the Sequelize model includes a bunch of metadata junk
  const userObject: User = user.toJSON() as User

  if (userObject.id !== tokenID) {
    throw {
      status: 400,
      message: 'you do not have permission to this account\'s private info'
    }
  }

  return userObject
}

// ascending order means oldest posts on top
const sortByDate = (posts: PostObject[], ascending: boolean): PostObject[] => {
  return posts.sort((a, b) => {
    if (a.createdAt > b.createdAt) {
      return ascending ? 1 : -1
    } else if (a.createdAt < b.createdAt) {
      return ascending ? -1 : 1
    } else {
      return 0
    }
  })
}

// organize posts by parent/child
export const organizePosts = (posts: PostObject[]): PostObject[] => {
  const parentPosts = posts.filter((post) => !post.parent)

  const sortedParents = sortByDate(parentPosts, false)

  // Sort the posts into a hierarchical object with replies as children, etc
  const parentsWithReplies = sortedParents.map((post: PostObject) => post = {
    replies: sortByDate(posts.filter((childPost) => childPost.parent === post.id), true),
    ...post
  })
  return parentsWithReplies
}