import login from '../services/login'
import userService from '../services/users'
import postService from '../services/posts'
import { LoginData, RegisterData } from '../types'

// When the site is reloaded, the login cookie is validated serverside
// to make sure 1) the user account still exists and 2) the token is still valid
export const initializeUser = () => {
  return async dispatch => {
    let res
    const userObject = await JSON.parse(window.localStorage.getItem('loggedInGroupreader'))
    try {
      if (userObject) {
        res = await userService.validateToken(userObject.token)
      } else {
        res = null
      }
    } catch(e) {
      await window.localStorage.removeItem('loggedInGroupreader')
    } finally {
      dispatch({
        type: 'INIT_USER',
        data: {
          storedToken: userObject,
          res: res ? res : null
        }
      })
    }
  }
}

export const logInUser = (loginCredentials: LoginData) => {
  return async dispatch => {
    try {
      const user = await login.login(loginCredentials)
      await window.localStorage.setItem('loggedInGroupreader', JSON.stringify(user))
      dispatch({
        type: 'LOGIN',
        data: user
      })
      return user
    } catch(error) {
      return error.response.data
    }
  }
}

export const logOutUser = () => {
  return async dispatch => {
    await window.localStorage.removeItem('loggedInGroupreader')
    dispatch({
      type: 'LOGOUT'
    })
  }
}

export const registerUser = (registerCredentials: RegisterData) => {
  return async dispatch => {
    try{
      const user = await login.register(registerCredentials)
      await window.localStorage.setItem('loggedInGroupreader', JSON.stringify(user))
      dispatch({
        type: 'REGISTER',
        data: user
      })
      return user
    } catch(error) {
      return error.response.data
    }
  }
}

const userReducer = (state = [], action) => {
  switch(action.type) {
  case 'INIT_USER':
    if (!action.data.res) {
      return null
    } else if (action.data.res.success) {
      const user = action.data.storedToken
      postService.setToken(user.token)
      return user
    } else {
      return null
    }
  case 'LOGIN':
    if (!action.data) {
      return state
    } else {
      const user = action.data
      postService.setToken(user.token)
      return user
    }
  case 'LOGOUT':
    return null
  case 'REGISTER':
    if (!action.data) {
      return state
    } else {
      const user = action.data
      postService.setToken(user.token)
      return user
    }
  default:
    return state
  }
}

export default userReducer