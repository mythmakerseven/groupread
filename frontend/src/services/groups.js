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

const createGroup = async group => {
  const res = await axios.post(baseUrl, group)
  return res.data
}

export default { getAllGroups, getGroupDetails, getGroupPosts, getGroupMembers, createGroup }