import axios from 'axios'
const baseUrl = '/api/groups'

const getAllGroups = async () => {
  const res = await axios.get(`${baseUrl}/all`)
  return res.data
}

const getGroupDetails = async id => {
  const res = await axios.get(`${baseUrl}/${id}`)
  return res.data
}

const getGroupPosts = async id => {
  const res = await axios.get(`${baseUrl}/${id}/posts`)
  return res.data
}

const getGroupMembers = async id => {
  const res = await axios.get(`${baseUrl}/${id}/members`)
  return res.data
}

const createGroup = async (group, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }
  const res = await axios.post(baseUrl, group, config)
  return res.data
}

const joinGroup = async (groupID, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }
  const res = await axios.post(`${baseUrl}/join/${groupID}`, null, config)
  return res.data
}

const setSchedule = async (weekObject, groupID, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }
  const res = await axios.post(`${baseUrl}/schedule/${groupID}`, weekObject, config)
  return res.data
}

export default { getAllGroups, getGroupDetails, getGroupPosts, getGroupMembers, createGroup, joinGroup, setSchedule }