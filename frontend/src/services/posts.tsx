import axios from 'axios'
const baseUrl = '/api/posts'

import {
  NewPostObject,
  EditPostObject,
  Post
} from '../types'

let token: string | null = null

const setToken = (newToken: string): void => {
  token = `bearer ${newToken}`
}

const sendNewPost = async (id: string, postObject: NewPostObject): Promise<Post> => {
  const config = {
    headers: { Authorization: token }
  }

  const res = await axios.post(`${baseUrl}/${id}/`, postObject, config)
  return res.data
}

const editPost = async (postID: string, postObject: EditPostObject): Promise<Post> => {
  const config = {
    headers: { Authorization: token }
  }

  const res = await axios.put(`${baseUrl}/edit/${postID}`, postObject, config)
  return res.data
}

export default { token, setToken, sendNewPost, editPost }