import axios from 'axios'
const baseUrl = '/api/users'

const getUsername = async (id: string) => {
  const res = await axios.get(`${baseUrl}/${id}/username`)
  return res.data
}

const validateToken = async (token: string) => {
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }
  const res = await axios.post(`${baseUrl}/validate`, null, config)
  return res.data
}

export default { getUsername, validateToken }