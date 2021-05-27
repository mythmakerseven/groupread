// IMPORTANT: This reducer is temporary for early development. Version 1.0 will not load all groups into state.

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import groupService from '../services/groups'
import {
  Group
} from '../types'

export type GroupListState = Group[]
const initialState = [] as GroupListState

export const getAllGroups = createAsyncThunk(
  '/groupList/getAllGroupsStatus',
  async () => {
    const groups = await groupService.getAllGroups()
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

export const groupListSelector = (state: { groupListStore: GroupListState }): GroupListState => state.groupListStore