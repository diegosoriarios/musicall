import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../../auth/AuthContext'
import {
  ChatIcon,
  MusicNoteIcon,
  RefreshIcon,
  SparklesIcon,
  UsersIcon,
} from '../../components/icons'
import { socket } from '../../sockets/socket'
import { withSpotify } from '../../lib/spotify'
import type { PresenceEntry } from '../../types'
import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { PageHeader } from '../../components/ui/PageHeader'
import { Skeleton } from '../../components/ui/Skeleton'

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

const EMPTY_TRACK: NowPlaying = {
  name: '',
  image: '',
  band: '',
  bandImage: '',
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xxl}px;
`

const HeroCard = styled.section<{ $image: string }>`
  position: relative;
  min-height: 360px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-height: 420px;
  }
`

const HeroBackdrop = styled.div<{ $image: string }>`
  position: absolute;
  inset: -24px;
  background-image: ${({ $image }) => ($image ? `url(${$image})` : 'none')};
  background-position: center;
  background-size: cover;
  filter: blur(26px) saturate(1.2);
  opacity: ${({ $image }) => ($image ? 0.48 : 0)};
  transform: scale(1.08);
`

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background:
    ${({ theme }) => theme.gradients.albumOverlay},
    linear-gradient(180deg, transparent 22%, rgba(7, 7, 9, 0.72) 100%);
`

const HeroContent = styled.div`
  position: relative;
  display: flex;
  min-height: 360px;
  align-items: flex-end;
  gap: ${({ theme }) => theme.space.xl}px;
  padding: clamp(24px, 4vw, 44px);

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-height: 420px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    gap: ${({ theme }) => theme.space.lg}px;
  }
`

const ArtworkWrap = styled.div`
  flex: none;
`

const Artwork = styled.img`
  width: clamp(150px, 20vw, 210px);
  aspect-ratio: 1;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: ${({ theme }) => theme.radii.lg};
  object-fit: cover;
  box-shadow: ${({ theme }) => theme.shadows.floating};
`

const ArtworkFallback = styled.div`
  display: flex;
  width: clamp(150px, 20vw, 210px);
  aspect-ratio: 1;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.gradients.accent};
  color: ${({ theme }) => theme.colors.accentText};
  box-shadow: ${({ theme }) => theme.shadows.floating};

  svg {
    width: 56px;
    height: 56px;
  }
`

const HeroInfo = styled.div`
  min-width: 0;
  flex: 1;
`

const TrackEyebrow = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 ${({ theme }) => theme.space.sm}px;
  color: ${({ theme }) => theme.colors.accentHover};
  font-size: ${({ theme }) => theme.font.sizes.xs};
  font-weight: ${({ theme }) => theme.font.weights.bold};
  letter-spacing: 0.14em;
  text-transform: uppercase;
`

const TrackTitle = styled.h2`
  max-width: 760px;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: clamp(28px, 4.4vw, 48px);
  font-weight: ${({ theme }) => theme.font.weights.black};
  letter-spacing: -0.055em;
  line-height: 1.05;
`

const TrackArtist = styled.p`
  margin: ${({ theme }) => theme.space.sm}px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.sizes.lg};
`

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.sm}px;
  margin-top: ${({ theme }) => theme.space.lg}px;
`

const HeroStatus = styled.p`
  max-width: 520px;
  margin: ${({ theme }) => theme.space.sm}px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.sizes.sm};
`

const HeroSkeleton = styled.div`
  display: flex;
  min-height: 360px;
  align-items: flex-end;
  gap: ${({ theme }) => theme.space.xl}px;
  padding: clamp(24px, 4vw, 44px);

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-height: 420px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
  }
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg}px;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md}px;
`

const SectionTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm}px;
`

const SectionIcon = styled.span`
  display: inline-flex;
  color: ${({ theme }) => theme.colors.accentHover};

  svg {
    width: 20px;
    height: 20px;
  }
`

const SectionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizes.xl};
  font-weight: ${({ theme }) => theme.font.weights.bold};
  letter-spacing: -0.03em;
`

const SectionMeta = styled.span`
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: ${({ theme }) => theme.font.sizes.xs};
  font-variant-numeric: tabular-nums;
`

const SimilarCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.lg}px;
  background:
    radial-gradient(circle at 0% 50%, rgba(29, 185, 84, 0.13), transparent 44%),
    ${({ theme }) => theme.colors.surface};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    align-items: flex-start;
    flex-direction: column;
  }
`

const SimilarArtwork = styled.img`
  width: 104px;
  height: 104px;
  border-radius: ${({ theme }) => theme.radii.md};
  object-fit: cover;
  flex: none;
`

const SimilarFallback = styled.div`
  display: flex;
  width: 104px;
  height: 104px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceRaised};
  color: ${({ theme }) => theme.colors.accentHover};
  flex: none;
`

const SimilarCopy = styled.div`
  min-width: 0;
  flex: 1;
`

const SimilarTitle = styled.h3`
  margin: ${({ theme }) => theme.space.xs}px 0 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizes.lg};
  font-weight: ${({ theme }) => theme.font.weights.bold};
  letter-spacing: -0.02em;
`

const SimilarDescription = styled.p`
  margin: ${({ theme }) => theme.space.xs}px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.sizes.sm};
`

const ListenerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: ${({ theme }) => theme.space.md}px;
`

const ListenerCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md}px;
  padding: ${({ theme }) => theme.space.md}px;
`

const ListenerCopy = styled.div`
  min-width: 0;
  flex: 1;
`

const ListenerName = styled.p`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs}px;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizes.sm};
  font-weight: ${({ theme }) => theme.font.weights.semibold};
`

const ListenerMeta = styled.p`
  overflow: hidden;
  margin: 3px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.sizes.xs};
  text-overflow: ellipsis;
  white-space: nowrap;
`

const LoadingListener = styled(Card)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md}px;
  padding: ${({ theme }) => theme.space.md}px;
`

function ListenerItem({
  listener,
  sameArtist,
  onMessage,
}: {
  listener: PresenceEntry
  sameArtist: boolean
  onMessage: (listener: PresenceEntry) => void
}) {
  return (
    <ListenerCard>
      <Avatar src={null} name={listener.username} size={44} loading="lazy" />
      <ListenerCopy>
        <ListenerName>
          {listener.username}
          {sameArtist ? <Badge tone="accent">Same artist</Badge> : null}
        </ListenerName>
        <ListenerMeta>
          {listener.band} · {listener.songName}
        </ListenerMeta>
      </ListenerCopy>
      <Button size="sm" variant="secondary" onClick={() => onMessage(listener)}>
        Message
      </Button>
    </ListenerCard>
  )
}

export default function HomePage() {
  const { user, refreshSpotifyToken } = useAuth()
  const navigate = useNavigate()

  const [nowPlaying, setNowPlaying] = useState<NowPlaying>(EMPTY_TRACK)
  const [playbackError, setPlaybackError] = useState('')
  const [loading, setLoading] = useState(true)
  const [similar, setSimilar] = useState<SimilarArtist | null>(null)
  const [similarLoading, setSimilarLoading] = useState(false)
  const [listeners, setListeners] = useState<PresenceEntry[]>([])

  const loadNowPlaying = useCallback(async () => {
    setLoading(true)
    setPlaybackError('')
    try {
      const playbackState = await withSpotify(
        (client) => client.getMyCurrentPlaybackState(),
        refreshSpotifyToken,
      )

      const item = playbackState?.item
      if (!item) {
        setNowPlaying(EMPTY_TRACK)
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
        image: item.album.images[0]?.url ?? '',
        band,
        bandImage,
      })

      socket.emit('presence:playing', { band, songName: item.name })
    } catch (error) {
      console.error('Failed to load now playing:', error)
      setNowPlaying(EMPTY_TRACK)
      setPlaybackError('Could not load your playback state. Is Spotify open?')
    } finally {
      setLoading(false)
    }
  }, [refreshSpotifyToken])

  useEffect(() => {
    void loadNowPlaying()

    function onPresenceState(state: PresenceEntry[]) {
      setListeners(state ?? [])
    }

    socket.on('presence:state', onPresenceState)
    return () => {
      socket.off('presence:state', onPresenceState)
      socket.emit('presence:stop')
    }
  }, [loadNowPlaying])

  async function findSimilarArtist() {
    if (!nowPlaying.band) return
    setSimilarLoading(true)
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
    } finally {
      setSimilarLoading(false)
    }
  }

  function openChatWithRoom(room: string) {
    navigate(`/chat?room=${encodeURIComponent(room)}`)
  }

  function handleListenerClick(listener: PresenceEntry) {
    const room = [user?.username, listener.username].sort().join('-')
    openChatWithRoom(room)
  }

  const sameBandListeners = listeners.filter(
    (listener) =>
      listener.userId !== user?.id && listener.band.toLowerCase() === nowPlaying.band.toLowerCase(),
  )
  const otherListeners = listeners.filter(
    (listener) =>
      listener.userId !== user?.id && listener.band.toLowerCase() !== nowPlaying.band.toLowerCase(),
  )
  const hasTrack = Boolean(nowPlaying.band || nowPlaying.name)
  const artwork = nowPlaying.bandImage || nowPlaying.image
  const otherListenerCount = otherListeners.length

  return (
    <Page>
      <PageHeader
        eyebrow="Live"
        title="Listening"
        description="See what is playing now, discover a related artist, and find people listening along with you."
        actions={
          <Button
            variant="secondary"
            leftIcon={<RefreshIcon />}
            onClick={() => void loadNowPlaying()}
            loading={loading}
          >
            Refresh
          </Button>
        }
      />

      <HeroCard $image={artwork} aria-live="polite">
        {artwork ? <HeroBackdrop $image={artwork} /> : null}
        <HeroOverlay />
        {loading ? (
          <HeroSkeleton>
            <Skeleton $width="180px" $height="180px" $radius="16px" />
            <div style={{ flex: 1 }}>
              <Skeleton $width="120px" $height="14px" />
              <div style={{ height: 12 }} />
              <Skeleton $width="min(520px, 80%)" $height="42px" />
              <div style={{ height: 12 }} />
              <Skeleton $width="220px" $height="20px" />
            </div>
          </HeroSkeleton>
        ) : (
          <HeroContent>
            <ArtworkWrap>
              {artwork ? (
                <Artwork src={artwork} alt={nowPlaying.band || 'Album artwork'} loading="eager" />
              ) : (
                <ArtworkFallback aria-hidden="true">
                  <MusicNoteIcon />
                </ArtworkFallback>
              )}
            </ArtworkWrap>
            <HeroInfo>
              <TrackEyebrow>
                <MusicNoteIcon />
                Now playing
              </TrackEyebrow>
              <TrackTitle>{hasTrack ? nowPlaying.name : 'Nothing is playing yet'}</TrackTitle>
              {hasTrack ? <TrackArtist>{nowPlaying.band}</TrackArtist> : null}
              {playbackError ? <HeroStatus>{playbackError}</HeroStatus> : null}
              <HeroActions>
                {hasTrack ? (
                  <Button
                    leftIcon={<ChatIcon />}
                    onClick={() => openChatWithRoom(`${nowPlaying.band}-${nowPlaying.name}`)}
                  >
                    Message room
                  </Button>
                ) : (
                  <Button leftIcon={<RefreshIcon />} onClick={() => void loadNowPlaying()}>
                    Check Spotify
                  </Button>
                )}
                <Button
                  variant="secondary"
                  leftIcon={<SparklesIcon />}
                  onClick={() => void findSimilarArtist()}
                  loading={similarLoading}
                  disabled={!nowPlaying.band}
                >
                  Find similar
                </Button>
              </HeroActions>
            </HeroInfo>
          </HeroContent>
        )}
      </HeroCard>

      <Section>
        <SectionHeader>
          <SectionTitleWrap>
            <SectionIcon>
              <SparklesIcon />
            </SectionIcon>
            <SectionTitle>Artist discovery</SectionTitle>
          </SectionTitleWrap>
          <SectionMeta>{similar ? 'Fresh pick' : 'Powered by Spotify'}</SectionMeta>
        </SectionHeader>
        <SimilarCard>
          {similar ? (
            <SimilarArtwork src={similar.image} alt={similar.name} loading="lazy" />
          ) : (
            <SimilarFallback aria-hidden="true">
              <MusicNoteIcon />
            </SimilarFallback>
          )}
          <SimilarCopy>
            <Badge tone="accent">Similar artist</Badge>
            <SimilarTitle>{similar ? similar.name : 'Find your next favorite artist'}</SimilarTitle>
            <SimilarDescription>
              {similar
                ? 'A new artist picked from the same corner of music.'
                : 'Start with the artist you are playing and branch out.'}
            </SimilarDescription>
          </SimilarCopy>
          <Button
            variant="secondary"
            onClick={() => void findSimilarArtist()}
            loading={similarLoading}
            disabled={!nowPlaying.band}
          >
            {similar ? 'Shuffle again' : 'Discover'}
          </Button>
        </SimilarCard>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitleWrap>
            <SectionIcon>
              <UsersIcon />
            </SectionIcon>
            <SectionTitle>Listening now</SectionTitle>
          </SectionTitleWrap>
          <SectionMeta>{sameBandListeners.length + otherListenerCount} live</SectionMeta>
        </SectionHeader>

        {loading ? (
          <ListenerGrid>
            <LoadingListener>
              <Skeleton $width="44px" $height="44px" $radius="50%" />
              <div style={{ flex: 1 }}>
                <Skeleton $width="70%" />
                <div style={{ height: 8 }} />
                <Skeleton $width="48%" $height="12px" />
              </div>
            </LoadingListener>
            <LoadingListener>
              <Skeleton $width="44px" $height="44px" $radius="50%" />
              <div style={{ flex: 1 }}>
                <Skeleton $width="62%" />
                <div style={{ height: 8 }} />
                <Skeleton $width="42%" $height="12px" />
              </div>
            </LoadingListener>
          </ListenerGrid>
        ) : sameBandListeners.length + otherListenerCount === 0 ? (
          <Card>
            <EmptyState
              icon={<UsersIcon />}
              title="No one else is listening right now"
              description="Keep Musicall open. When other people start playing something, they will show up here."
            />
          </Card>
        ) : (
          <ListenerGrid>
            {sameBandListeners.map((listener) => (
              <ListenerItem
                key={listener.userId}
                listener={listener}
                sameArtist
                onMessage={handleListenerClick}
              />
            ))}
            {otherListeners.map((listener) => (
              <ListenerItem
                key={listener.userId}
                listener={listener}
                sameArtist={false}
                onMessage={handleListenerClick}
              />
            ))}
          </ListenerGrid>
        )}
      </Section>
    </Page>
  )
}
