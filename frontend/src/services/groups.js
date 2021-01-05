import axios from 'axios'
const baseUrl = 'http://localhost:3000/api/groups' // TODO: make this work without hardcoding

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAllGroups = async id => {
  const req = axios.get(`${baseUrl}/all`)
  return req
    .then(res => res.data)
}

const getGroupDetails = async id => {
  const req = axios.get(`${baseUrl}/${id}`)
  return req
    .then(res => res.data)
}

const getGroupMembers = async id => {
  const req = axios.get(`${baseUrl}/${id}/members`)
  return req
    .then(res => res.data)
}

export default { setToken, getAllGroups, getGroupDetails, getGroupMembers }