import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import api from '../../api/client'
import { useAuth } from '../../auth/AuthContext'
import Header from '../../components/Header'
import { DeleteIcon, FavoriteBorderIcon } from '../../components/icons'
import type { Post } from '../../types'
import { customColors } from '../../assets/colors'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  margin: 0;
  background-color: grey;
  align-self: center;
  position: relative;
`

const Post = styled.article`
  width: 96%;
  margin: 1%;
  background-color: white;
  display: flex;
  flex-direction: column;
  position: relative;
`

const PostHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 2%;
`

const Avatar = styled.img`
  margin-left: 25px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
`

const Username = styled.h1`
  margin: 0;
  margin-left: 25px;
  font-size: 24px;
`

const DateText = styled.h3`
  margin: 0;
  position: absolute;
  font-size: 16px;
  right: 5px;
  top: 5px;
`

const Content = styled.div`
  width: 90%;
  align-self: center;
  justify-content: center;
  margin-bottom: 5%;

  p {
    word-wrap: break-word;
  }
`

const Likes = styled.div`
  display: flex;
  flex-direction: row;
  align-self: center;
  align-items: center;
`

const LikeText = styled.p`
  margin: 0 2%;
`

const NewPostBox = styled.div`
  width: 96%;
  background-color: #aaa;
  border-radius: 15px;
  margin: 2%;
  padding: 2% 0;
  display: flex;
  flex-direction: column;
`

const NewPostBoxTop = styled.div`
  flex-direction: row;
  display: flex;
  margin-top: 2%;
`

const NewPostBoxBottom = styled.div`
  flex-direction: row-reverse;
  display: flex;
`

const NewPostInput = styled.textarea`
  margin: 0 2%;
  flex: 2;
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
`

const NewPostBoxButton = styled.button`
  margin: 2%;
  width: 100px;
  height: 25px;
  background-color: ${customColors.green};
  border-radius: 25px;
  color: white;
  border: none;
`

const LoadMoreButton = styled(NewPostBoxButton)`
  align-self: center;
  width: 150px;
`

function formatPostDate(sqlDate: string): string {
  const parsed = new Date(sqlDate.includes('T') ? sqlDate : `${sqlDate.replace(' ', 'T')}Z`)
  if (Number.isNaN(parsed.getTime())) return sqlDate
  return parsed.toLocaleString()
}

export default function Feed() {
  const { user } = useAuth()

  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  const loadFeed = useCallback(async (targetPage: number) => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get<Post[]>('/posts', {
        params: { page: targetPage },
      })
      const totalFromHeader = Number(response.headers['x-total-count'] ?? 0)
      setTotal(totalFromHeader)
      setPosts((prev) => (targetPage === 1 ? response.data : [...prev, ...response.data]))
      setPage(targetPage)
    } catch {
      setError('Failed to load the feed.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadFeed(1)
  }, [loadFeed])

  async function handleCreatePost() {
    const trimmed = content.trim()
    if (!trimmed) return

    try {
      await api.post('/posts', { content: trimmed })
      setContent('')
      await loadFeed(1)
    } catch {
      setError('Failed to create the post.')
    }
  }

  async function handleDeletePost(id: number) {
    try {
      await api.delete(`/posts/${id}`)
      await loadFeed(1)
    } catch {
      setError('Failed to delete the post.')
    }
  }

  const hasMore = posts.length < total

  return (
    <Container>
      <Header title="Feed" />
      <NewPostBox>
        <NewPostBoxTop>
          <Avatar src={user?.avatar} alt={user?.username} />
          <NewPostInput
            placeholder="Share something about music..."
            value={content}
            maxLength={500}
            onChange={(event) => setContent(event.target.value)}
          />
        </NewPostBoxTop>
        <NewPostBoxBottom>
          <NewPostBoxButton onClick={() => void handleCreatePost()} disabled={!content.trim()}>
            Post
          </NewPostBoxButton>
        </NewPostBoxBottom>
      </NewPostBox>

      {error ? <p style={{ color: 'white', textAlign: 'center' }}>{error}</p> : null}

      {loading && posts.length === 0 ? (
        <h1 style={{ color: 'white', textAlign: 'center' }}>Loading...</h1>
      ) : (
        posts.map((post) => (
          <Post key={post.id}>
            <PostHeader>
              <Avatar src={post.avatar} alt={post.username} />
              <Username>{post.username}</Username>
              {post.user_id === user?.id ? (
                <Tooltip title="Delete post">
                  <IconButton
                    size="small"
                    sx={{ marginLeft: 'auto', marginRight: '25px', color: '#c0392b' }}
                    onClick={() => void handleDeletePost(post.id)}
                    aria-label="Delete post"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              ) : null}
            </PostHeader>
            <Content>
              <p>{post.content}</p>
              <Likes>
                <FavoriteBorderIcon />
                <LikeText>{post.likes}</LikeText>
              </Likes>
            </Content>
            <DateText>{formatPostDate(post.created_at)}</DateText>
          </Post>
        ))
      )}

      {hasMore ? (
        <LoadMoreButton onClick={() => void loadFeed(page + 1)}>Load more</LoadMoreButton>
      ) : null}
    </Container>
  )
}
