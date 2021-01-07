// IMPORTANT: This reducer is temporary for early development. Version 1.0 will not load all groups into state.

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

const groupListReducer = (state = [], action) => {
  switch(action.type) {
  case 'INIT_GROUPS':
  {
    const groups = action.data
    return groups
  }
  default:
    return state
  }
}

export default groupListReducer