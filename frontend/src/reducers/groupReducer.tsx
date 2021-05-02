import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import groupService from '../services/groups'
import postService from '../services/posts'

import { NonMemberGroup, MemberGroup, GroupCreationData } from '../types'

// The "group" state is actually an array of all group data from every visited group.
// This way, we cache some data so the user can visit an already-visited group
// without having to wait for loading.
type GroupState = Array<NonMemberGroup | MemberGroup>

const initialState = [] as GroupState

interface GroupCreationPayload {
  groupObject: GroupCreationData,
  token: string
}

interface NewPostPayload {
  id: string,
  postObject: object
}

interface JoinGroupPayload {
  id: string,
  token: string
}

interface SetSchedulePayload {
  weekObject: object,
  groupID: string,
  token: string
}

export const getGroupDetails = createAsyncThunk(
  '/group/groupDetailsStatus',
  async (id: string, thunkAPI) => {
    const group = await groupService.getGroupDetails(id)
    return group
  }
)

export const getGroupPosts = createAsyncThunk(
  '/group/groupPostsStatus',
  async (id: string, thunkAPI) => {
    try {
      const posts = await groupService.getGroupPosts(id)
      return {
        posts: posts,
        id: id
      }
    } catch(e) {
      throw new Error(`${e.message}`)
    }
  }
)

export const getGroupMembers = createAsyncThunk(
  '/group/groupMembersStatus',
  async (id: string, thunkAPI) => {
    try {
      const members = await groupService.getGroupMembers(id)
      return {
        members: members,
        id: id
        }
    } catch(e) {
      throw new Error(`${e.message}`)
    }
  }
)

export const createGroup = createAsyncThunk(
  '/group/createGroupStatus',
  async (payload: GroupCreationPayload, thunkAPI) => {
    try {
      const response = await groupService.createGroup(payload.groupObject, payload.token)
      return response
    } catch(e) {
      throw new Error(`${e.message}`)
    }
  }
)

export const newPost = createAsyncThunk(
  '/group/newPostStatus',
  async (payload: NewPostPayload, thunkAPI) => {
    try {
      const res = await postService.sendNewPost(payload.id, payload.postObject)
      if (payload.postObject.parent) {
        // legacy behavior because I couldn't figure out how to implement conditional action types
        // ideally this will be rewritten with some RTK-native thing but it works fine now
        return {
          type: 'reply',
          data: res
        }
      } else {
        return {
          type: 'reply',
          data: res
        }        
      }
    } catch(e) {
      throw new Error(`${e.message}`)
    }
  }
)

export const joinGroup = createAsyncThunk(
  '/group/joinGroupStatus',
  async (payload: JoinGroupPayload, thunkAPI) => {
    try {
      await groupService.joinGroup(payload.id, payload.token)
      const newMemberList = await groupService.getGroupMembers(payload.id)
      return {
        groupID: payload.id,
        members: newMemberList
      }
    } catch(e) {
      throw new Error(`${e.message}`)
    }
  }
)

export const setSchedule = createAsyncThunk(
  '/groups/setScheduleStatus',
  async (payload: SetSchedulePayload, thunkAPI) => {
    try {
      const res = await groupService.setSchedule(payload.weekObject, payload.groupID, payload.token)
      return {
        groupID: payload.groupID,
        posts: res
      }
    } catch(e) {
      throw new Error(`${e.message}`)
    }
  }
)

const groupSlice = createSlice({
  name: 'groupSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getGroupDetails.fulfilled, (state, { payload }) => {
      const group = payload
      if (state.find(g => g.id === group.id)) {
        return state = state
      }
      return state = [ ...state, group ]
    }),
    builder.addCase(getGroupPosts.fulfilled, (state, { payload }) => {
      const posts = payload.posts
      const id = payload.id
      return state = state.map(g => g.id === id ? g = { ...g, posts: posts } : g)
    }),
    builder.addCase(getGroupMembers.fulfilled, (state, { payload }) => {
      const members = payload.members
      const id = payload.id
      return state = state.map(g => g.id === id ? g = { ...g, members: members } : g)
    }),
    builder.addCase(createGroup.fulfilled, (state, { payload }) => {
      const group = payload
      return state = [...state, group]
    }),
    builder.addCase(newPost.fulfilled, (state, { payload }) => {
      if (payload.type === 'reply') {
        // New post that will be associated with a parent post
        // The frontend uses nested objects for this
        const groupID = payload.data.GroupId
        const parentID = payload.data.parent
        return state = state.map(g => {
          if (g.id === groupID) {
            const posts = g.posts.map(p => {
              if (p.id === parentID) {
                const replies = [ ...p.replies, payload.data ]
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
      } else {
        // New top-level post
        const groupID = payload.data.groupID
        return state = state.map(g => g.id === groupID ? g = { ...g, posts: [ ...payload.data ] } : g)
      }
    }),
    builder.addCase(joinGroup.fulfilled, (state, { payload }) => {
      const group = state.find(g => g.id === payload.groupID)
      if (!group) {
        return state = state
      }
      return state = state.map(g => g.id === payload.groupID ? g = { ...g, members: payload.members } : g)
    }),
    builder.addCase(setSchedule.fulfilled, (state, { payload }) => {
      const groupID = payload.groupID
      const posts = payload.posts
      return state = state.map(g => g.id === groupID ? g = { ...g, posts: [ ...posts ] } : g)
    })
  }
})

export default groupSlice.reducer

export const groupSelector = (state: { groupStore: GroupState }): GroupState => state.groupStore