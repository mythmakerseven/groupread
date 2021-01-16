import axios from 'axios'
const baseUrl = '/api/groups'

// let token = null

// const setToken = newToken => {
//   token = `bearer ${newToken}`
// }

const getAllGroups = async () => {
  const req = axios.get(`${baseUrl}/all`)
  return req
    .then(res => res.data)
}

const getGroupDetails = async id => {
  const req = axios.get(`${baseUrl}/${id}`)
  return req
    .then(res => res.data)
}

const getGroupPosts = async id => {
  const req = axios.get(`${baseUrl}/${id}/posts`)
  return req
    .then(res => res.data)
}

const getGroupMembers = async id => {
  const req = axios.get(`${baseUrl}/${id}/members`)
  return req
    .then(res => res.data)
}

const createGroup = async group => {
  const res = await axios.post(baseUrl, group)
  return res.data
}

export default { getAllGroups, getGroupDetails, getGroupPosts, getGroupMembers, createGroup }