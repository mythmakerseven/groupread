import axios, { AxiosResponse } from 'axios'
import { UserObject } from '../types'

const baseUrl = '/api/users'

const getUsername = async (id: string): Promise<AxiosResponse> => {
  const res = await axios.get(`${baseUrl}/${id}/username`)
  return res.data
}

// If successful, the server returns { success: 'token remains valid' }.
// If validation fails, it returns { error: ${error message} }.
const validateToken = async (token: string): Promise<{ error: string | null, success: string | null }> => {
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }
  const res = await axios.post(`${baseUrl}/validate`, null, config)
  return res.data
}

const getPersonalInfo = async (id: string, token: string): Promise<UserObject> => {
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }

  const res = await axios.get(`${baseUrl}/info/${id}`, config)
  return res.data
}

export default { getUsername, validateToken, getPersonalInfo }