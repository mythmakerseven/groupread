// IMPORTANT: This reducer is temporary for early development. Version 1.0 will not load all groups into state.

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import groupService from '../services/groups'

// TODO: implement a proper type for group data
type groupListState = Array<Object>

const initialState = [] as groupListState

export const getAllGroups = createAsyncThunk(
  '/groupList/getAllGroupsStatus',
  async (thunkAPI) => {
    let groups = await groupService.getAllGroups()
    return groups
  }
)

// TODO: handle connection errors if the server is down
const groupListSlice = createSlice({
  name: 'groupList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllGroups.fulfilled, (state, { payload }) => {
      return state = payload
    })
  }
})

export default groupListSlice.reducer

export const groupListSelector = (state: { groupListStore: groupListState }): groupListState => state.groupListStore