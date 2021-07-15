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

  const res = await axios({
    url: `${baseUrl}/${id}/`,
    method: 'post',
    data: postObject,
    validateStatus: status => [200, 400, 401, 404].includes(status),
    headers: config.headers
  })

  if (res.status >= 400 && res.status <= 404) {
    throw new Error(res.data.error)
  }

  return res.data
}

const editPost = async (postID: string, postObject: EditPostObject): Promise<Post> => {
  const config = {
    headers: { Authorization: token }
  }

  const res = await axios({
    url: `${baseUrl}/edit/${postID}`,
    method: 'put',
    data: postObject,
    validateStatus: status => [200, 400, 401, 404].includes(status),
    headers: config.headers
  })

  if (res.status >= 400 && res.status <= 404) {
    throw new Error(res.data.error)
  }

  return res.data
}

export default { token, setToken, sendNewPost, editPost }