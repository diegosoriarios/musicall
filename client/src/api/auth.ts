import api from '../api/client'

export interface SpotifyTokenResponse {
  accessToken: string
  expiresIn: number
}

/** Returns the params from the URL hash fragment and clears it. */
export function consumeHashParams(): Record<string, string> {
  const hash = window.location.hash.substring(1)
  const params: Record<string, string> = {}
  const regex = /([^&;=]+)=?([^&;]*)/g
  let match: RegExpExecArray | null
  while ((match = regex.exec(hash))) {
    params[match[1]] = decodeURIComponent(match[2])
  }
  if (hash) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
  }
  return params
}

export async function fetchCurrentUser() {
  const response = await api.get('/auth/me')
  return response.data
}

export async function fetchSpotifyToken() {
  const response = await api.post<SpotifyTokenResponse>('/auth/spotify-token')
  return response.data
}

export async function logoutRequest() {
  await api.post('/auth/logout')
}
