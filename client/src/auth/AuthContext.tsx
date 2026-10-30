import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { API_URL } from '../api/client'
import { consumeHashParams, fetchCurrentUser, fetchSpotifyToken, logoutRequest } from '../api/auth'
import { clearSpotifyAccessToken, setSpotifyAccessToken } from '../lib/spotify'
import type { User } from '../types'

type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

interface AuthContextValue {
  status: AuthStatus
  user: User | null
  login: () => void
  logout: () => Promise<void>
  refreshSpotifyToken: () => Promise<string>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      // A Spotify access token may arrive in the hash after the OAuth
      // callback redirect. Use it immediately, then persist only the
      // httpOnly session cookie server-side.
      const hashParams = consumeHashParams()
      const hashToken = hashParams['spotify_access_token']
      if (hashToken) {
        setSpotifyAccessToken(hashToken)
      }
      if (hashParams['error']) {
        console.warn('Login failed:', hashParams['error'])
      }

      try {
        const me = await fetchCurrentUser()
        if (cancelled) return
        setUser(me)

        // Restore/refresh the in-memory Spotify token from the session.
        // Failure here keeps the session valid (feed/chat still work);
        // playback features will retry via refreshSpotifyToken().
        try {
          const tokenResponse = await fetchSpotifyToken()
          setSpotifyAccessToken(tokenResponse.accessToken)
        } catch (error) {
          console.warn('Could not restore Spotify token yet:', error)
        }

        setStatus('authenticated')
      } catch {
        if (cancelled) return
        clearSpotifyAccessToken()
        setStatus('anonymous')
      }
    }

    void bootstrap()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(() => {
    window.location.href = `${API_URL}/api/auth/login`
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } finally {
      clearSpotifyAccessToken()
      setUser(null)
      setStatus('anonymous')
    }
  }, [])

  const refreshSpotifyToken = useCallback(async () => {
    const tokenResponse = await fetchSpotifyToken()
    setSpotifyAccessToken(tokenResponse.accessToken)
    return tokenResponse.accessToken
  }, [])

  const value = useMemo(
    () => ({ status, user, login, logout, refreshSpotifyToken }),
    [status, user, login, logout, refreshSpotifyToken],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
