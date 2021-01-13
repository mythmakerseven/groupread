import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import groupListReducer from './reducers/groupListReducer'
import groupReducer from './reducers/groupReducer'
import groupCreationReducer from './reducers/groupCreationReducer'

const reducer = combineReducers({
  group: groupReducer,
  groupList: groupListReducer,
  groupFormData: groupCreationReducer
})

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)

export default store