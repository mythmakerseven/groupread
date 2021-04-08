import axios from 'axios'
const baseUrl = '/api/login'
import { LoginData, RegisterData } from '../types'

const login = async (credentials: LoginData) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

const register = async (credentials: RegisterData) => {
  const response = await axios.post('/api/users', credentials)
  return response.data
}

export default { login, register }