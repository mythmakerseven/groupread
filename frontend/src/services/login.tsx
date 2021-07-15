import axios from 'axios'
const baseUrl = '/api/login'
import { LoginData, RegisterData } from '../types'

interface UserResponse {
  token: string,
  username: string,
  displayName: string,
  id: string
}

const login = async (credentials: LoginData): Promise<UserResponse> => {
  const res = await axios({
    url: baseUrl,
    method: 'post',
    data: credentials,
    validateStatus: status => [200, 400, 401, 404].includes(status),
  })

  if (res.status >= 400 && res.status <= 404) {
    throw new Error(res.data.error)
  }

  return res.data
}

const register = async (credentials: RegisterData): Promise<UserResponse> => {
  const res = await axios({
    url: '/api/users',
    method: 'post',
    data: credentials,
    validateStatus: status => [200, 400, 401, 404].includes(status),
  })

  if (res.status >= 400 && res.status <= 404) {
    throw new Error(res.data.error)
  }

  return res.data
}

export default { login, register }