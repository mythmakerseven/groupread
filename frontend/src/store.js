import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import groupListReducer from './reducers/groupListReducer'
import groupReducer from './reducers/groupReducer'

const reducer = combineReducers({
  group: groupReducer,
  groupList: groupListReducer
})

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)

export default store