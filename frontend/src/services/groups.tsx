import axios from 'axios'
import {
  GroupCreationData
} from '../types'

const baseUrl = '/api/groups'

const getAllGroups = async () => {
  const res = await axios.get(`${baseUrl}/all`)
  return res.data
}

const getGroupDetails = async (id: string) => {
  const res = await axios.get(`${baseUrl}/${id}`)
  return res.data
}

const getGroupPosts = async (id: string) => {
  const res = await axios.get(`${baseUrl}/${id}/posts`)
  return res.data
}

const getGroupMembers = async (id: string) => {
  const res = await axios.get(`${baseUrl}/${id}/members`)
  return res.data
}

const createGroup = async (group: GroupCreationData, token: string) => {
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

const joinGroup = async (groupID: string, token: string) => {
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }
  const res = await axios.post(`${baseUrl}/join/${groupID}`, null, config)
  return res.data
}

// weekObject is hard to type because it is pretty dynamic.
// It has one key for each week, and the number will vary
// depending on how many weeks the user chooses.
const setSchedule = async (weekObject: any, groupID: string, token: string) => {
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }
  const res = await axios.post(`${baseUrl}/schedule/${groupID}`, weekObject, config)
  return res.data
}

export default { getAllGroups, getGroupDetails, getGroupPosts, getGroupMembers, createGroup, joinGroup, setSchedule }