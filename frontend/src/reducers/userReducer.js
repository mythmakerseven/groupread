import login from '../services/login'
// import { setToken } from '../services/groups'

export const initializeUser = () => {
  return async dispatch => {
    const userToken = await window.localStorage.getItem('loggedInGroupreader')
    dispatch({
      type: 'INIT_USER',
      data: userToken
    })
  }
}

export const logInUser = userObject => {
  return async dispatch => {
    try {
      const user = await login.login(userObject)
      await window.localStorage.setItem('loggedInGroupreader', JSON.stringify(user))
      dispatch({
        type: 'LOGIN',
        data: user
      })
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

export const registerUser = userObject => {
  return async dispatch => {
    try{
      const user = await login.register(userObject)
      await window.localStorage.setItem('loggedInGroupreader', JSON.stringify(user))
      dispatch({
        type: 'REGISTER',
        data: user
      })
    } catch(error) {
      return error.response.data
    }
  }
}

const userReducer = (state = [], action) => {
  switch(action.type) {
  case 'INIT_USER':
    if (!action.data) {
      return null
    } else {
      const user = JSON.parse(action.data)
      // setToken(user.token)
      return user
    }
  case 'LOGIN':
    if (!action.data) {
      return state
    } else {
      const user = action.data
      // setToken(user.token)
      return user
    }
  case 'LOGOUT':
    return null
  case 'REGISTER':
    if (!action.data) {
      return state
    } else {
      const user = action.data
      // setToken(user.token)
      return user
    }
  default:
    return state
  }
}

export default userReducer