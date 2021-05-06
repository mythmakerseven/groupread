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
  const res = await axios.post(baseUrl, group, config)
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