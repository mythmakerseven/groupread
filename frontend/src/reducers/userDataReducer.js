import userService from '../services/users'

export const usernameLookup = id => {
  return async dispatch => {
    try {
      const username = await userService.getUsername(id)
      dispatch({
        type: 'RESOLVE_USERNAME',
        data: {
          id: id,
          username: username
        }
      })
      return username
    } catch(error) {
      // might be best to silently handle this error on the frontend
      return null
    }
  }
}

const userDataReducer = (state = [], action) => {
  switch(action.type) {
  case 'RESOLVE_USERNAME':
  {
    const currentCache = state.map(u => u.id)
    if (currentCache.includes(action.data.id)) {
      return state
    } else {
      return state.concat(action.data)
    }
  }
  default:
    return state
  }
}

export default userDataReducer