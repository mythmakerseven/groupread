import groupService from '../services/groups'

export const getGroupDetails = id => {
  return async dispatch => {
    const group = await groupService.getGroupDetails(id)
    dispatch({
      type: 'VIEW_GROUP',
      data: group
    })
  }
}

export const getGroupPosts = id => {
  return async dispatch => {
    const posts = await groupService.getGroupPosts(id)
    dispatch({
      type: 'GROUP_POSTS',
      data: {
        posts: posts,
        id: id
      }
    })
  }
}

export const getGroupMembers = id => {
  return async dispatch => {
    const members = await groupService.getGroupMembers(id)
    dispatch({
      type: 'LIST_MEMBERS',
      data: {
        members: members,
        id: id
      }
    })
  }
}

export const createGroup = groupObject => {
  return async dispatch => {
    try{
      const response = await groupService.createGroup(groupObject)
      dispatch({
        type: 'CREATE_GROUP',
        data: response
      })
      return response
    } catch(error) {
      return error.response.data
    }
  }
}

const groupReducer = (state = [], action) => {
  switch(action.type) {
  case 'VIEW_GROUP':
  {
    const group = action.data
    if (state.find(g => g === group)) return state
    return [ ...state, group ]
  }
  case 'GROUP_POSTS':
  {
    const posts = action.data.posts
    const id = action.data.id
    return state.map(g => g.id === id ? g = { ...g, posts: posts } : g)
  }
  case 'LIST_MEMBERS':
  {
    const members = action.data.members
    const id = action.data.id
    return state.map(g => g.id === id ? g = { ...g, members: members } : g)
  }
  case 'CREATE_GROUP':
  {
    const group = action.data
    return [...state, group]
  }
  default:
    return state
  }
}

export default groupReducer