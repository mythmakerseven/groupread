import groupService from '../services/groups'

export const getAllGroups = () => {
  return async dispatch => {
    const groups = await groupService.getAllGroups()
    dispatch({
      type: 'INIT_GROUPS',
      data: groups
    })
  }
}

export const getGroupDetails = () => {
  return async dispatch => {
    const group = await groupService.getGroupDetails()
    dispatch({
      type: 'VIEW_GROUP',
      data: group
    })
  }
}

const groupReducer = (state = [], action) => {
  switch(action.type) {
    case 'VIEW_GROUP':
      const group = action.data
      return group
    case 'INIT_GROUPS':
      const groups = action.data
      return groups
    default:
      return state
  }
}

export default groupReducer