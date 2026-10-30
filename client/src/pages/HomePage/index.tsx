import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../../auth/AuthContext'
import { socket } from '../../sockets/socket'
import { withSpotify } from '../../lib/spotify'
import type { PresenceEntry } from '../../types'
import { customColors } from '../../assets/colors'
import logoImg from '../../assets/logo.png'
import loginBackground from '../../assets/login.svg'
import spotifyBrand from '../../assets/spotify-brands.svg'

const DEFAULT_IMAGE =
  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'

interface NowPlaying {
  name: string
  image: string
  band: string
  bandImage: string
}

interface SimilarArtist {
  name: string
  image: string
}

// ---------- login screen styles ----------

const LoginContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100vh;
  background: ${customColors.black};
  margin: 0;
`

const LoginPanel = styled.div`
  background-image: url(${logoImg});
  background-repeat: no-repeat;
  background-size: 20%;
  background-position: center 50px;
  height: 100vh;
  width: 50vw;
  display: flex;
  background-color: ${customColors.green};
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`

const LoginImage = styled.img`
  height: 25px;
`

const LoginText = styled.h4`
  height: 25px;
  margin: 0;
  color: ${customColors.green};
  text-decoration: none;
  line-height: 25px;
`

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: ${customColors.black};
  width: 250px;
  height: 50px;
  border-radius: 100px;
  color: white;
  outline: none;
  border: none;
  &:hover {
    transform: scale(1.03);
  }
`

const LoginBackground = styled.img`
  height: 50vh;
`

// ---------- player styles ----------

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  margin: 0;
  background-color: #ccc;
`

const PlayerContainer = styled.section<{ $backgroundImage: string }>`
  min-height: 40vh;
  background-color: ${customColors.black};
  background-image: url(${(props) => props.$backgroundImage});
  background-repeat: no-repeat;
  background-size: cover;
  background-position-y: -300px;
  width: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  margin-top: 70px;
  z-index: 2;
`

const MusicImage = styled.img`
  width: 75px;
  height: 75px;
  border-radius: 50%;
`

const MusicTitle = styled.h1`
  color: white;
  margin-bottom: 3%;
  font-size: 18px;
`

const MusicButton = styled.button`
  background-color: ${customColors.green};
  width: 150px;
  height: 25px;
  border-radius: 100px;
  color: white;
  margin-top: 3%;
  outline: none;
  border: none;
`

const SimilarContainer = styled.section`
  min-height: 20vh;
  background-color: ${customColors.green};
  width: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  border-top: 50px solid ${customColors.green};
  margin-top: -50px;
`

const ListenersSection = styled.section`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  padding: 2%;
`

const ListenerButton = styled.button`
  background-color: ${customColors.black};
  color: white;
  border: none;
  border-radius: 100px;
  padding: 6px 14px;
`

export default function HomePage() {
  const { status, user, login, refreshSpotifyToken } = useAuth()
  const navigate = useNavigate()

  const [nowPlaying, setNowPlaying] = useState<NowPlaying>({
    name: '',
    image: '',
    band: '',
    bandImage: '',
  })
  const [playbackError, setPlaybackError] = useState('')
  const [similar, setSimilar] = useState<SimilarArtist | null>(null)
  const [listeners, setListeners] = useState<PresenceEntry[]>([])

  const loadNowPlaying = useCallback(async () => {
    setPlaybackError('')
    try {
      const playbackState = await withSpotify(
        (client) => client.getMyCurrentPlaybackState(),
        refreshSpotifyToken,
      )

      const item = playbackState?.item
      if (!item) {
        setNowPlaying({ name: '', image: '', band: '', bandImage: '' })
        setPlaybackError('Nothing is playing on your Spotify right now.')
        return
      }

      const band = item.artists[0]?.name ?? ''
      const bandImage = await withSpotify(
        (client) => client.getArtist(item.artists[0].id),
        refreshSpotifyToken,
      )
        .then((artist) => artist.images[0]?.url ?? '')
        .catch(() => '')

      setNowPlaying({
        name: item.name,
        image: item.album.images[0]?.url ?? DEFAULT_IMAGE,
        band,
        bandImage,
      })

      socket.emit('presence:playing', { band, songName: item.name })
    } catch (error) {
      console.error('Failed to load now playing:', error)
      setPlaybackError('Could not load your playback state. Is Spotify open?')
    }
  }, [refreshSpotifyToken])

  useEffect(() => {
    if (status !== 'authenticated') return

    void loadNowPlaying()

    function onPresenceState(state: PresenceEntry[]) {
      setListeners(state ?? [])
    }
    socket.on('presence:state', onPresenceState)
    return () => {
      socket.off('presence:state', onPresenceState)
      socket.emit('presence:stop')
    }
  }, [status, loadNowPlaying])

  async function findSimilarArtist() {
    if (!nowPlaying.band) return
    try {
      const search = await withSpotify(
        (client) => client.searchArtists(nowPlaying.band),
        refreshSpotifyToken,
      )
      const artistId = search.artists.items[0]?.id
      if (!artistId) return

      const related = await withSpotify(
        (client) => client.getArtistRelatedArtists(artistId),
        refreshSpotifyToken,
      )
      const withImages = related.artists.filter((artist) => artist.images.length > 0)
      if (withImages.length === 0) return

      const random = Math.floor(Math.random() * withImages.length)
      setSimilar({
        name: withImages[random].name,
        image: withImages[random].images[0].url,
      })
    } catch (error) {
      console.error('Failed to find similar artists:', error)
    }
  }

  function openChatWithRoom(room: string) {
    navigate(`/chat?room=${encodeURIComponent(room)}`)
  }

  function handleListenerClick(listener: PresenceEntry) {
    const room = [user?.username, listener.username].sort().join('-')
    openChatWithRoom(room)
  }

  if (status !== 'authenticated') {
    return (
      <LoginContainer>
        <div
          style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'flex-end',
          }}
        >
          <LoginBackground src={loginBackground} alt="" />
        </div>
        <LoginPanel>
          <LoginButton onClick={login}>
            <LoginImage src={spotifyBrand} alt="" />
            <LoginText>Login with spotify</LoginText>
          </LoginButton>
        </LoginPanel>
      </LoginContainer>
    )
  }

  const sameBandListeners = listeners.filter(
    (listener) =>
      listener.userId !== user?.id && listener.band.toLowerCase() === nowPlaying.band.toLowerCase(),
  )
  const otherListeners = listeners.filter(
    (listener) =>
      listener.userId !== user?.id && listener.band.toLowerCase() !== nowPlaying.band.toLowerCase(),
  )

  return (
    <Container>
      <PlayerContainer $backgroundImage={nowPlaying.image}>
        <MusicTitle>
          {nowPlaying.band
            ? `Now playing: ${nowPlaying.band} - ${nowPlaying.name}`
            : 'Now playing: nothing detected'}
        </MusicTitle>
        <div>
          <MusicImage
            src={!nowPlaying.image ? DEFAULT_IMAGE : nowPlaying.bandImage || nowPlaying.image}
            alt={nowPlaying.band}
          />
        </div>
        {playbackError ? <MusicTitle>{playbackError}</MusicTitle> : null}
        <MusicButton onClick={() => void loadNowPlaying()}>Check Now Playing</MusicButton>
        {nowPlaying.band ? (
          <MusicButton onClick={() => openChatWithRoom(`${nowPlaying.band}-${nowPlaying.name}`)}>
            Message
          </MusicButton>
        ) : null}
      </PlayerContainer>

      <SimilarContainer>
        {similar ? (
          <>
            <h2>{similar.name}</h2>
            <img src={similar.image} alt={similar.name} style={{ width: 100 }} />
          </>
        ) : (
          <h2>Discover a similar artist</h2>
        )}
        <MusicButton onClick={() => void findSimilarArtist()}>Similar</MusicButton>
      </SimilarContainer>

      <ListenersSection>
        {sameBandListeners.map((listener) => (
          <ListenerButton key={listener.userId} onClick={() => handleListenerClick(listener)}>
            {listener.username} — same band as you
          </ListenerButton>
        ))}
        {otherListeners.map((listener) => (
          <ListenerButton key={listener.userId} onClick={() => handleListenerClick(listener)}>
            {listener.username} — {listener.band}
          </ListenerButton>
        ))}
      </ListenersSection>
    </Container>
  )
}
