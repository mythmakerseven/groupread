import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import login from '../services/login'
import userService from '../services/users'
import postService from '../services/posts'
import { LoginData, RegisterData } from '../types'

export interface UserInfo {
  username: string,
  displayName: string,
  id: string,
  token: string
}

export type UserState = UserInfo | null

export const initialState = null as UserState

// Thunks

// When the site is reloaded, the login cookie is validated serverside
// to make sure 1) the user account still exists and 2) the token is still valid
export const initializeUser = createAsyncThunk(
  '/users/initializeUserStatus',
  async (thunkAPI) => {
    let res
    const userObject = await JSON.parse(window.localStorage.getItem('loggedInGroupreader') || '{}')
    try {
      // This '{}' thing is an annoying hack to fix a TS quirk, as JSON.parse
      // can only accept a string and not a null value
      if (JSON.stringify(userObject) === '{}') {
        throw new Error("No user found")
      }
      res = await userService.validateToken(userObject.token)
      if (!res.success) {
        throw new Error("Invalid token")
      }
      return userObject
    } catch(e) {
      throw new Error("Invalid token")
    }
  }
)

export const logInUser = createAsyncThunk(
  '/users/logInUserStatus',
  async (loginCredentials: LoginData, thunkAPI) => {
    try {
      const user = await login.login(loginCredentials)
      return user
    } catch(error) {
      throw new Error(`${error.response.data.error}`)
    }
  }
)

export const registerUser = createAsyncThunk(
  '/users/registerUserStatus',
  async (registerCredentials: RegisterData, thunkAPI) => {
    try {
      const user = await login.register(registerCredentials)
      return user
    } catch(error) {
      throw new Error(`${error.response.data.error}`)
    }
  }
)

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    logOutUser(state, action: PayloadAction) {
      window.localStorage.removeItem('loggedInGroupreader')
      return state = initialState
    }
  },
  extraReducers: (builder) => {
    builder.addCase(initializeUser.fulfilled, (state, { payload }) => {
      if (!payload) {
        return state = initialState
      } else {
        const user = payload
        postService.setToken(user.token)
        return state = user
      }
    }),
    builder.addCase(initializeUser.rejected, (state, { payload }) => {
      window.localStorage.removeItem('loggedInGroupreader')
      return state = initialState
    }),
    builder.addCase(logInUser.fulfilled, (state, { payload }) => {
      const user = payload
      window.localStorage.setItem('loggedInGroupreader', JSON.stringify(user))
      postService.setToken(user.token)
      return state = user
    }),
    builder.addCase(logInUser.rejected, (state, { payload }) => {
      return state = initialState
    }),
    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      const user = payload
      window.localStorage.setItem('loggedInGroupreader', JSON.stringify(user))
      postService.setToken(user.token)
      return state = user
    }),
    builder.addCase(registerUser.rejected, (state, { payload }) => {
      return state = initialState
    })
  }
})

// export const initializeUser = () => {
//   return async dispatch => {
//     let res
//     const userObject = await JSON.parse(window.localStorage.getItem('loggedInGroupreader'))
//     try {
//       if (userObject) {
//         res = await userService.validateToken(userObject.token)
//       } else {
//         res = null
//       }
//     } catch(e) {
//       await window.localStorage.removeItem('loggedInGroupreader')
//     } finally {
//       dispatch({
//         type: 'INIT_USER',
//         data: {
//           storedToken: userObject,
//           res: res ? res : null
//         }
//       })
//     }
//   }
// }

// export const logInUser = (loginCredentials: LoginData) => {
//   return async dispatch => {
//     try {
//       const user = await login.login(loginCredentials)
//       window.localStorage.setItem('loggedInGroupreader', JSON.stringify(user))
//       dispatch({
//         type: 'LOGIN',
//         data: user
//       })
//       return user
//     } catch(error) {
//       return error.response.data
//     }
//   }
// }

// export const logOutUser = () => {
//   return async dispatch => {
//     window.localStorage.removeItem('loggedInGroupreader')
//     dispatch({
//       type: 'LOGOUT'
//     })
//   }
// }

// export const registerUser = (registerCredentials: RegisterData) => {
//   return async dispatch => {
//     try{
//       const user = await login.register(registerCredentials)
//       window.localStorage.setItem('loggedInGroupreader', JSON.stringify(user))
//       dispatch({
//         type: 'REGISTER',
//         data: user
//       })
//       return user
//     } catch(error) {
//       return error.response.data
//     }
//   }
// }

// const userReducer = (state = [], action) => {
//   switch(action.type) {
  // case 'INIT_USER':
  //   if (!action.data.res) {
  //     return null
  //   } else if (action.data.res.success) {
  //     const user = action.data.storedToken
  //     postService.setToken(user.token)
  //     return user
  //   } else {
  //     return null
  //   }
  // case 'LOGIN':
  //   if (!action.data) {
  //     return state
  //   } else {
  //     const user = action.data
  //     postService.setToken(user.token)
  //     return user
  //   }
  // case 'LOGOUT':
  //   return null
//   case 'REGISTER':
//     if (!action.data) {
//       return state
//     } else {
//       const user = action.data
//       postService.setToken(user.token)
//       return user
//     }
//   default:
//     return state
//   }
// }

// export default userReducer

export const { logOutUser } = userSlice.actions

// other functions (so you don't have to scroll up):
// initializeUser, logInUser, registerUser

export default userSlice.reducer

export const userSelector = (state: { userStore: UserState }): UserState => state.userStore