import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import login from '../services/login'
import userService from '../services/users'
import postService from '../services/posts'
import { LoginData, RegisterData, UserState } from '../types'
import users from '../services/users'

export const initialState: UserState = { loading: false, data: null }

// Thunks

// When the site is reloaded, the login cookie is validated serverside
// to make sure 1) the user account still exists and 2) the token is still valid
export const initializeUser = createAsyncThunk(
  '/users/initializeUserStatus',
  async () => {
    let res
    const userObject = await JSON.parse(window.localStorage.getItem('loggedInGroupreader') || '{}')
    try {
      // This '{}' thing is an annoying hack to fix a TS quirk, as JSON.parse
      // can only accept a string and not a null value
      if (JSON.stringify(userObject) === '{}') {
        return null
      }
      res = await userService.validateToken(userObject.token)
      if (!res.success) {
        throw new Error('Invalid token')
      }
      return userObject
    } catch(e) {
      throw new Error('Invalid token')
    }
  }
)

export const logInUser = createAsyncThunk(
  '/users/logInUserStatus',
  async (loginCredentials: LoginData) => {
    try {
      const user = await login.login(loginCredentials)
      return user
    } catch(error) {
      throw new Error(`${error.message}`)
    }
  }
)

export const registerUser = createAsyncThunk(
  '/users/registerUserStatus',
  async (registerCredentials: RegisterData) => {
    try {
      const user = await login.register(registerCredentials)
      return user
    } catch(error) {
      throw new Error(`${error.message}`)
    }
  }
)

export const getPersonalInfo = createAsyncThunk(
  '/users/getPersonalInfo',
  async (payload: { id: string, token: string }) => {
    try {
      const userData = await users.getPersonalInfo(payload.id, payload.token)
      return userData
    } catch(error) {
      throw new Error(`${error.response.data.error}`)
    }
  }
)

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    logOutUser() {
      window.localStorage.removeItem('loggedInGroupreader')
      return initialState
    }
  },
  extraReducers: (builder) => {
    builder.addCase(initializeUser.fulfilled, (state, { payload }) => {
      if (!payload) {
        return state = initialState
      } else {
        const user = payload
        postService.setToken(user.token)
        return state = {
          loading: false,
          data: {
            Groups: [],
            ...user,
          }
        }
      }
    }),
    builder.addCase(initializeUser.pending, (state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return state = {
        loading: true,
        data: null
      }
    }),
    builder.addCase(initializeUser.rejected, () => {
      window.localStorage.removeItem('loggedInGroupreader')
      return initialState
    }),
    builder.addCase(logInUser.fulfilled, (state, { payload }) => {
      window.localStorage.setItem('loggedInGroupreader', JSON.stringify(payload))
      postService.setToken(payload.token)

      // The type expects a Groups field, so set it here as an empty array to be populated later.
      return state = {
        loading: false,
        data: {
          Groups: [],
          ...payload
        }
      }
    }),
    builder.addCase(logInUser.rejected, (state, { error }) => {
      throw new Error(error.message)
    }),
    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      const user = payload
      window.localStorage.setItem('loggedInGroupreader', JSON.stringify(user))
      postService.setToken(user.token)
      return state = {
        loading: false,
        data: {
          Groups: [],
          ...user
        }
      }
    }),
    builder.addCase(registerUser.rejected, (state, { error }) => {
      throw new Error(error.message)
    }),
    builder.addCase(getPersonalInfo.fulfilled, (state, { payload }) => {
      return state = {
        loading: false,
        data: {
          ...state.data,
          ...payload
        }
      }
    })
  }
})

export const { logOutUser } = userSlice.actions

// other exported functions (so you don't have to scroll up lol):
// initializeUser, logInUser, registerUser

export default userSlice.reducer

export const userSelector = (state: { userStore: UserState }): UserState => state.userStore