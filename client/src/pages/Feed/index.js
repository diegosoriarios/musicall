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
  NewPostBoxBottom
} from './styles'
import { Favorite, FavoriteBorder, PostAdd } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import FlatList from 'flatlist-react';
import Header from '../../components/Header/'

const data = [{
    "id": 1,
    "username": "kimpey0",
    "content": "transform leading-edge markets",
    "avatar": "https://robohash.org/doloremillumpossimus.jpg?size=50x50&set=set1",
    "likes": 28,
    "created_at": "6/23/2019"
  }, {
    "id": 2,
    "username": "mtansly1",
    "content": "envisioneer proactive systems",
    "avatar": "https://robohash.org/idteneturipsum.bmp?size=50x50&set=set1",
    "likes": 42,
    "created_at": "7/30/2019"
  }, {
    "id": 3,
    "username": "ewellman2",
    "content": "productize magnetic networks",
    "avatar": "https://robohash.org/nihilquiid.bmp?size=50x50&set=set1",
    "likes": 61,
    "created_at": "9/14/2019"
  }, {
    "id": 4,
    "username": "averrill3",
    "content": "enhance scalable web services",
    "avatar": "https://robohash.org/cupiditatequiasequi.bmp?size=50x50&set=set1",
    "likes": 24,
    "created_at": "6/23/2019"
  }, {
    "id": 5,
    "username": "ccardall4",
    "content": "monetize interactive metrics",
    "avatar": "https://robohash.org/sedatomnis.jpg?size=50x50&set=set1",
    "likes": 42,
    "created_at": "3/21/2019"
  }, {
    "id": 6,
    "username": "cocorrigane5",
    "content": "morph holistic relationships",
    "avatar": "https://robohash.org/eligendiillorerum.bmp?size=50x50&set=set1",
    "likes": 51,
    "created_at": "4/11/2019"
  }, {
    "id": 7,
    "username": "acroxford6",
    "content": "utilize 24/365 supply-chains",
    "avatar": "https://robohash.org/debitisveniamearum.png?size=50x50&set=set1",
    "likes": 78,
    "created_at": "9/15/2019"
  }, {
    "id": 8,
    "username": "fchestnut7",
    "content": "facilitate ubiquitous e-commerce",
    "avatar": "https://robohash.org/architectoducimusculpa.jpg?size=50x50&set=set1",
    "likes": 47,
    "created_at": "6/20/2019"
  }, {
    "id": 9,
    "username": "cludlamme8",
    "content": "recontextualize innovative communities",
    "avatar": "https://robohash.org/natusmolestiasest.jpg?size=50x50&set=set1",
    "likes": 92,
    "created_at": "10/25/2019"
  }, {
    "id": 10,
    "username": "ohatto9",
    "content": "empower bricks-and-clicks portals",
    "avatar": "https://robohash.org/nequerecusandaeasperiores.png?size=50x50&set=set1",
    "likes": 45,
    "created_at": "1/5/2020"
  }, {
    "id": 11,
    "username": "nsawdena",
    "content": "integrate turn-key content",
    "avatar": "https://robohash.org/sitevenietut.png?size=50x50&set=set1",
    "likes": 84,
    "created_at": "12/1/2019"
  }, {
    "id": 12,
    "username": "bchazelasb",
    "content": "architect ubiquitous e-markets",
    "avatar": "https://robohash.org/faceresuntofficia.bmp?size=50x50&set=set1",
    "likes": 73,
    "created_at": "9/21/2019"
  }, {
    "id": 13,
    "username": "glewendonc",
    "content": "deploy interactive interfaces",
    "avatar": "https://robohash.org/fugiatsedvel.bmp?size=50x50&set=set1",
    "likes": 70,
    "created_at": "2/28/2020"
  }, {
    "id": 14,
    "username": "lstagged",
    "content": "streamline robust interfaces",
    "avatar": "https://robohash.org/voluptasmollitiaut.bmp?size=50x50&set=set1",
    "likes": 23,
    "created_at": "2/22/2020"
  }, {
    "id": 15,
    "username": "dsteffane",
    "content": "expedite seamless communities",
    "avatar": "https://robohash.org/oditullamet.jpg?size=50x50&set=set1",
    "likes": 26,
    "created_at": "2/29/2020"
  }, {
    "id": 16,
    "username": "rocannavanf",
    "content": "monetize global e-services",
    "avatar": "https://robohash.org/mollitiaoccaecatiet.bmp?size=50x50&set=set1",
    "likes": 36,
    "created_at": "8/9/2019"
  }, {
    "id": 17,
    "username": "doclearyg",
    "content": "e-enable B2C communities",
    "avatar": "https://robohash.org/autvoluptatibusdolore.png?size=50x50&set=set1",
    "likes": 87,
    "created_at": "2/29/2020"
  }, {
    "id": 18,
    "username": "aleaskh",
    "content": "target wireless web-readiness",
    "avatar": "https://robohash.org/temporibusetducimus.png?size=50x50&set=set1",
    "likes": 77,
    "created_at": "1/25/2020"
  }, {
    "id": 19,
    "username": "ltwiggsi",
    "content": "embrace plug-and-play solutions",
    "avatar": "https://robohash.org/eiusmolestiaeodit.png?size=50x50&set=set1",
    "likes": 46,
    "created_at": "8/4/2019"
  }, {
    "id": 20,
    "username": "ujeckellsj",
    "content": "mesh robust infomediaries",
    "avatar": "https://robohash.org/itaqueestfugit.jpg?size=50x50&set=set1",
    "likes": 35,
    "created_at": "12/15/2019"
  }, {
    "id": 21,
    "username": "rlopezk",
    "content": "benchmark dynamic synergies",
    "avatar": "https://robohash.org/accusamusmolestiasqui.bmp?size=50x50&set=set1",
    "likes": 90,
    "created_at": "5/4/2019"
  }, {
    "id": 22,
    "username": "bkochlinl",
    "content": "redefine one-to-one deliverables",
    "avatar": "https://robohash.org/iustocumnecessitatibus.png?size=50x50&set=set1",
    "likes": 8,
    "created_at": "9/5/2019"
  }, {
    "id": 23,
    "username": "mtroppmannm",
    "content": "unleash frictionless initiatives",
    "avatar": "https://robohash.org/nonautdelectus.png?size=50x50&set=set1",
    "likes": 15,
    "created_at": "2/29/2020"
  }, {
    "id": 24,
    "username": "cnaultyn",
    "content": "maximize revolutionary models",
    "avatar": "https://robohash.org/debitisassumendanobis.jpg?size=50x50&set=set1",
    "likes": 82,
    "created_at": "5/26/2019"
  }, {
    "id": 25,
    "username": "dkerwino",
    "content": "envisioneer open-source infrastructures",
    "avatar": "https://robohash.org/utcupiditateneque.png?size=50x50&set=set1",
    "likes": 12,
    "created_at": "2/8/2020"
  }, {
    "id": 26,
    "username": "ghamsherp",
    "content": "aggregate intuitive architectures",
    "avatar": "https://robohash.org/voluptatemliberoodio.jpg?size=50x50&set=set1",
    "likes": 77,
    "created_at": "11/9/2019"
  }, {
    "id": 27,
    "username": "dhadrillq",
    "content": "generate 24/365 portals",
    "avatar": "https://robohash.org/autemcupiditateest.jpg?size=50x50&set=set1",
    "likes": 17,
    "created_at": "11/16/2019"
  }, {
    "id": 28,
    "username": "clegraver",
    "content": "e-enable next-generation partnerships",
    "avatar": "https://robohash.org/quisunttemporibus.bmp?size=50x50&set=set1",
    "likes": 24,
    "created_at": "7/13/2019"
  }, {
    "id": 29,
    "username": "bswains",
    "content": "recontextualize compelling convergence",
    "avatar": "https://robohash.org/doloresquisquamin.bmp?size=50x50&set=set1",
    "likes": 86,
    "created_at": "5/9/2019"
  }, {
    "id": 30,
    "username": "swheelant",
    "content": "seize leading-edge supply-chains",
    "avatar": "https://robohash.org/inventoretemporibusoccaecati.jpg?size=50x50&set=set1",
    "likes": 28,
    "created_at": "9/5/2019"
  }]

export default function Feed({ loggedIn, user }) {
  const [hasMorePeople, setMorePoeple] = useState(true)
  const [isCreatingPost, setisCreatingPost] = useState(false)
  const [content, setContent] = useState("")
  const history = useHistory()

  useEffect(() => {
    setisCreatingPost(false)
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
      let post = {
        "id": data.length + 1,
        "username": user.name,
        "content": content,
        "avatar": user.image,
        "likes": 0,
        "created_at": getCurrentDate()
      }
      data.push(post)
      setisCreatingPost(false)
    }

    if (!loggedIn) history.push('/')
    
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
              <button onClick={() => handleCreatePost()}>Criar</button>
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
          <FlatList 
            style={{ zIndex: -1 }}
                list={data} 
                renderItem={renderPerson}
                hasMoreItems={hasMorePeople}
                loadMoreItems={fetchPeople}
                paginationLoadingIndicator={<Loader/>}
                paginationLoadingIndicatorPosition="center"
          />
        </Container>
    )
}

const Loader = () => (
  <div>
    <h1>Loading...</h1>
  </div>
)