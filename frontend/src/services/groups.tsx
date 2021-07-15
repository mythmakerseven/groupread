import axios from 'axios'
import {
  Group,
  GroupCreationData,
  Post,
  User
} from '../types'

const baseUrl = '/api/groups'

const getAllGroups = async (): Promise<Group[]> => {
  const res = await axios.get<Group[]>(`${baseUrl}/all`)
  return res.data
}

const getGroupDetails = async (id: string): Promise<Group> => {
  const res = await axios.get<Group>(`${baseUrl}/${id}`)
  return res.data
}

const getGroupPosts = async (id: string): Promise<Post[]> => {
  const res = await axios.get<Post[]>(`${baseUrl}/${id}/posts`)
  return res.data
}

const getGroupMembers = async (id: string): Promise<User[]> => {
  const res = await axios.get<User[]>(`${baseUrl}/${id}/members`)
  return res.data
}

const createGroup = async (group: GroupCreationData, token: string): Promise<Group> => {
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }

  // validateStatus sets the promise to resolve on error, so we can get the
  // server's error message response to display on the frontend.
  // For some reason, the axios requests in ./login.tsx return the proper error
  // message without needing the validateStatus function. What's up with that?
  const res = await axios({
    url: baseUrl,
    method: 'post',
    data: group,
    validateStatus: status => status < 500,
    headers: config.headers
  })

  if (res.status === 400) {
    throw new Error(`${res.data.error}`)
  }

  return res.data
}

interface JoinGroupResponse {
  user: User,
  groupID: string
}

const joinGroup = async (groupID: string, token: string): Promise<JoinGroupResponse> => {
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }
  const res = await axios.post(`${baseUrl}/join/${groupID}`, null, config)
  return res.data
}

// weekObject is hard to type because it is pretty dynamic.
// It has one key for each week, and the number will vary
// depending on how many weeks the user chooses.
const setSchedule = async (weekObject: unknown, groupID: string, token: string): Promise<Post[]> => {
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }

  const res = await axios({
    url: `${baseUrl}/schedule/${groupID}`,
    method: 'post',
    data: weekObject,
    validateStatus: status => [200, 400, 404].includes(status),
    headers: config.headers
  })

  if (res.status >= 400 && res.status <= 404) {
    throw new Error(res.data.error)
  }

  return res.data
}

export default { getAllGroups, getGroupDetails, getGroupPosts, getGroupMembers, createGroup, joinGroup, setSchedule }