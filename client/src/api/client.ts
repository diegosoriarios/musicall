import axios from 'axios'

/**
 * Base URL of the API. Empty string = same origin, which is what the Vite
 * dev proxy provides (and how production should be deployed).
 */
export const API_URL: string = import.meta.env.VITE_API_URL ?? ''

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
})

export default api
