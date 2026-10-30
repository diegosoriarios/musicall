declare module 'spotify-web-api-js' {
  export interface SpotifyImage {
    url: string
  }

  export interface SpotifyArtist {
    id: string
    name: string
  }

  export interface SpotifyAlbum {
    images: SpotifyImage[]
  }

  export interface SpotifyTrack {
    name: string
    album: SpotifyAlbum
    artists: SpotifyArtist[]
  }

  export interface SpotifyPlaybackState {
    item: SpotifyTrack | null
    is_playing: boolean
  }

  export interface SpotifyFullArtist extends SpotifyArtist {
    images: SpotifyImage[]
  }

  export interface SpotifyRelatedArtistsResponse {
    artists: SpotifyFullArtist[]
  }

  export interface SpotifySearchArtistsResponse {
    artists: {
      items: SpotifyFullArtist[]
    }
  }

  export default class Spotify {
    setAccessToken(accessToken: string): void
    getAccessToken(): string | undefined
    getMyCurrentPlaybackState(options?: Record<string, unknown>): Promise<SpotifyPlaybackState>
    getArtist(artistId: string): Promise<SpotifyFullArtist>
    searchArtists(
      query: string,
      options?: Record<string, unknown>,
    ): Promise<SpotifySearchArtistsResponse>
    getArtistRelatedArtists(artistId: string): Promise<SpotifyRelatedArtistsResponse>
  }
}
