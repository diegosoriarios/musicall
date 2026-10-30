import Spotify from 'spotify-web-api-js'

const spotify = new Spotify()

/**
 * Wraps a Spotify Web API call with automatic token recovery: on 401 the
 * caller-provided refresh function obtains a fresh access token from the
 * backend (which keeps the Spotify refresh token server-side) and the call
 * is retried once.
 */
export async function withSpotify<T>(
  call: (client: Spotify) => Promise<T>,
  refreshAccessToken: () => Promise<string>,
): Promise<T> {
  try {
    return await call(spotify)
  } catch (error) {
    const status = (error as { status?: number })?.status
    if (status !== 401) throw error

    const freshToken = await refreshAccessToken()
    spotify.setAccessToken(freshToken)
    return call(spotify)
  }
}

export function setSpotifyAccessToken(token: string): void {
  spotify.setAccessToken(token)
}

export function clearSpotifyAccessToken(): void {
  spotify.setAccessToken('')
}

export default spotify
