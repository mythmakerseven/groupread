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

export const getGroupMembers = id => {
  return async dispatch => {
    const members = await groupService.getGroupMembers(id)
    dispatch({
      type: 'LIST_MEMBERS',
      data: members
    })
  }
}

const groupReducer = (state = [], action) => {
  switch(action.type) {
  case 'VIEW_GROUP':
  {
    const group = action.data
    return group
  }
  case 'LIST_MEMBERS':
  {
    const members = action.data
    return { ...state, members: members }
  }
  default:
    return state
  }
}

export default groupReducer