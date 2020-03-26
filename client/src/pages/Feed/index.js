import React, { useState, useEffect } from 'react'
import { 
  Post, 
  FeedHeader, 
  Content, 
  Avatar, 
  Username, 
  Date, 
  Likes, 
  LikeText, 
  Container, 
  CreatePost,
  NewPostBox,
  NewPostInput,
  NewPostBoxTop,
  NewPostBoxBottom,
  NewPostBoxButton
} from './styles'
import { Favorite, FavoriteBorder, PostAdd } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import FlatList from 'flatlist-react';
import axios from 'axios'
import Header from '../../components/Header/'

export default function Feed({ loggedIn, user }) {
  const [hasMorePeople, setMorePeople] = useState(true)
  const [isCreatingPost, setisCreatingPost] = useState(false)
  const [content, setContent] = useState("")
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const history = useHistory()

  async function loadFeed() {
    setLoading(true)
    const response = await axios.get('http://localhost:4710/posts')

    const responseData = await response.data

    console.log(responseData)

    setData(responseData)
    setLoading(false)
  }

  useEffect(() => {
    setisCreatingPost(false)

    loadFeed()
  }, [])

    function renderPerson(post) {
      return (
        <Post key={post.id}>
          <FeedHeader>
              <Avatar src={post.avatar} alt={post.username} />
              <Username>{post.username}</Username>
              <Date>{post.created_at}</Date>
          </FeedHeader>
          <Content>
              <p>{post.content}</p>
              <Likes>
                  <FavoriteBorder />
                  <LikeText>{post.likes}</LikeText>
              </Likes>
          </Content>
        </Post>
      )
    }

    function fetchPeople() {

    }

    function openCreatePost() {
      setisCreatingPost(true)
    }

    function getCurrentDate() {
      let newDate = new window.Date()
      let day = newDate.getDate();
      let month = newDate.getMonth() + 1;
      let year = newDate.getFullYear();
      return `${day}/${month}/${year}`
    }

    function handleCreatePost() {
      if (content.trim().length > 0) {
        let post = {
          "id": data.length + 1,
          "username": user.name,
          "content": content,
          "avatar": user.image,
          "likes": 0,
          "created_at": getCurrentDate()
        }

        //FIXME: change authorization
        axios.post('http://localhost:4710/posts', post, {
          headers: { Authorization: 'f61dd2e9' }
        }).then(response => {
          loadFeed()
        }).catch(e => {
          console.log(e)
        })
        setisCreatingPost(false)
      }
    }

    if (!loggedIn) history.push('/')

    if (loading) return <h1>Loading</h1>
    
    if (isCreatingPost) {
      return (
        <>
          <Header title={'Create Post'} goBackActive={true} goBack={() => setisCreatingPost()} />
          <NewPostBox>
            <NewPostBoxTop>
              <Avatar src={user.image} alt={user.name} />
              <NewPostInput 
                type="text" 
                placeholder="Digite alguma coisa" 
                value={content}
                onChange={e=> setContent(e.target.value)}
              />
            </NewPostBoxTop>
            <NewPostBoxBottom>
              <NewPostBoxButton onClick={() => handleCreatePost()}>Criar</NewPostBoxButton>
            </NewPostBoxBottom>
          </NewPostBox>
        </>
      )
    }

    return (
        <Container>
          <Header title={'Feed'} />
          <CreatePost onClick={() => openCreatePost()}>
            <PostAdd style={{ color: 'white' }} />
          </CreatePost>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FlatList 
            style={{ zIndex: -1 }}
                list={data} 
                renderItem={renderPerson}
                hasMoreItems={hasMorePeople}
                loadMoreItems={fetchPeople}
                paginationLoadingIndicator={<Loader/>}
                paginationLoadingIndicatorPosition="center"
          />
          </div>

        </Container>
    )
}

const Loader = () => (
  <div>
    <h1>Loading...</h1>
  </div>
)