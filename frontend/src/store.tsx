import { configureStore } from '@reduxjs/toolkit'
import { composeWithDevTools } from 'redux-devtools-extension'

import groupListReducer from './reducers/groupListReducer'
import groupReducer from './reducers/groupReducer'
import groupCreationReducer from './reducers/groupCreationReducer'
import userReducer from './reducers/userReducer'

// TODO: add devtools and thunk back in
const store = configureStore({
  reducer: {
    group: groupReducer,
    groupList: groupListReducer,
    groupFormData: groupCreationReducer,
    user: userReducer
  }
})

export default store