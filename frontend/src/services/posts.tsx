import axios from 'axios'
const baseUrl = '/api/posts'

import {
  NewPostObject
} from '../types'

let token: string | null = null

const setToken = (newToken: string) => {
  token = `bearer ${newToken}`
}

const sendNewPost = async (id: string, postObject: NewPostObject) => {
  const config = {
    headers: { Authorization: token }
  }

  const res = await axios.post(`${baseUrl}/${id}/`, postObject, config)
  return res.data
}

export default { token, setToken, sendNewPost }