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
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

const register = async (credentials: RegisterData): Promise<UserResponse> => {
  const response = await axios.post('/api/users', credentials)
  return response.data
}

export default { login, register }