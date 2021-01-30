import groupService from '../services/groups'
import postService from '../services/posts'

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

export const newPost = (id, postObject) => {
  return async dispatch => {
    try {
      const res = await postService.sendNewPost(id, postObject)
      console.log(res)
      if (postObject.parent) {
        dispatch({
          type: 'NEW_REPLY',
          data: res
        })
      } else {
        dispatch({
          type: 'NEW_POST',
          data: res
        })
      }
      return res
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
  case 'NEW_POST':
  {
    // The actual name is GroupId but this line works anyway.
    const groupID = action.data.groupID
    return state.map(g => g.id === groupID ? g = { ...g, posts: [ ...action.data ] } : g)
  }
  case 'NEW_REPLY':
  {
    // However, this one returned undefined until I changed it
    // to say GroupId exactly. Why is this one case-sensitive while
    // the other isn't? I have verified that the server response
    // object uses the same GroupId field for both. There are no
    // differences in the objects provided to these two cases.
    const groupID = action.data.GroupId
    const parentID = action.data.parent
    return state.map(g => {
      if (g.id === groupID) {
        const posts = g.posts.map(p => {
          if (p.id === parentID) {
            const replies = [ ...p.replies, action.data ]
            return { ...p, replies: replies }
          } else {
            return p
          }
        })
        return { ...g, posts: posts }
      } else {
        return g
      }
    })
  }
  default:
    return state
  }
}

export default groupReducer