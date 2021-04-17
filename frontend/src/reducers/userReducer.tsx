import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import login from '../services/login'
import userService from '../services/users'
import postService from '../services/posts'
import { LoginData, RegisterData, UserObject } from '../types'

export type UserState = UserObject | null

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

export const { logOutUser } = userSlice.actions

// other exported functions (so you don't have to scroll up lol):
// initializeUser, logInUser, registerUser

export default userSlice.reducer

export const userSelector = (state: { userStore: UserState }): UserState => state.userStore