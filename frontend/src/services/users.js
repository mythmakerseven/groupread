import axios from 'axios'
const baseUrl = '/api/users'

const getUsername = async id => {
  const res = await axios.get(`${baseUrl}/${id}/username`)
  return res.data
}

export default { getUsername }