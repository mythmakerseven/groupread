import axios from 'axios'
const baseUrl = '/api/posts'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const sendNewPost = async (id, postObject) => {
  const config = {
    headers: { Authorization: token }
  }

  const res = await axios.post(`${baseUrl}/${id}/`, postObject, config)
  return res.data
}

export default { token, setToken, sendNewPost }