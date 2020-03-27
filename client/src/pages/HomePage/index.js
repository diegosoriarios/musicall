import React, { useState, useEffect } from 'react';
//import Spotify from 'spotify-web-api-js'
import openSocket from 'socket.io-client'
import { useHistory } from "react-router-dom";
import { 
  Container,
  LoginContainer,
  LoginButton, 
  PlayerContainer, 
  MusicImage,
  MusicTitle,
  MusicButton,
  SimilarContainer,
  LoginImage,
  LoginText,
  LoginTitle,
  LoginLogo
} from './styles'

import Header from '../../components/Header'
import logoImg from '../../assets/logo.png'

//const spotifyWebApi = new Spotify()
const DEFAULT_IMAGE = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
const socket = openSocket('http://localhost:3210')

function HomePage({ spotifyWebApi, params, loggedIn, addUserToChat, setProfileUser }) {


  //const [params, setParams] = useState(getHashParams())
  //console.log(params)
  //const [loggedIn, setLoggedIn] = useState(params.access_token ? true : false)
  const [nowPlaying, setNowPlaying] = useState({name: 'Not Checked', image: '', band: ''})
  const [similar, setSimilar] = useState("")
  const [list, setList] = useState([])
  const [user, setUser] = useState({})
  let history = useHistory();

  useEffect(() => {
    if (params.access_token) {
      spotifyWebApi.setAccessToken(params.access_token)
    }
    /*
    if (params.access_token) {
      spotifyWebApi.setAccessToken(params.access_token)
    }
    if (loggedIn) {
      getNowPlaying()
    }*/
    setUser({
      name: params.name,
      email: params.email,
      image: params.image
    })
    setProfileUser({
      name: params.name,
      email: params.email,
      image: params.image
    })
    socket.on('update_list', client => {
      console.log(client)
      for (let band in client) {
        console.log(band)
        for (let music in client[band]) {
          setList(client[band][music].users)
        }
      }
    })
  }, [])

  useEffect(() => {
    getNowPlaying()
  }, [user])

  function getNowPlaying() {
    spotifyWebApi.getMyCurrentPlaybackState()
    .then(response => {
      if(response.item) {
        setNowPlaying({
          name: response.item.name,
          image: response.item.album.images[0].url,
          band: response.item.artists[0].name
        })
        socket.emit('new_music', {
          band: response.item.artists[0].name,
          name: response.item.name,
          user: user.name
        })
      }
    })
    .catch(e => console.error(e))

    //let user
    //spotifyWebApi.getMe().then(response => console.log(response))

    /*newMusic({
      band: nowPlaying.band,
      name: nowPlaying.name,
      spotifyWebApi
    })*/
  }

  async function foundSimilarArtists(artist) {
    let artistId = await spotifyWebApi.searchArtists(artist).then(response => response.artists.items[0].id)

    console.log(artistId)

    return spotifyWebApi.getArtistRelatedArtists(artistId).then(response => {
      let random = Math.floor(Math.random() * response.artists.length)
      console.log(response.artists[random])
      setSimilar({ name: response.artists[random].name, image: response.artists[random].images[0].url})
    })
  }

  function createPrivateChat(user) {
    let conversation_id = `Diego Soria Rios-${user}`
    socket.emit('subscribe', conversation_id)
    socket.emit('send message', {
      room: conversation_id,
      message: "Some message"
    });
    
    socket.on('conversation private post', function(data) {
        //display data.message
    });
  }

  function handleChatClick(u) {
    addUserToChat(u)
    let name = user.name
    let room = u + '-' + user.name
    history.push(`/chat?name=${name}&room=${room}`)
  }

  function openChat() {
    let name = user.name
    let room = nowPlaying.band + '-' + nowPlaying.name
    history.push(`/chat?name=${name}&room=${room}`)
  }

  if (loggedIn) {
    return (
      <Container>
        <Header title={'Home'} />
        <PlayerContainer>
          <MusicTitle> Now playing: { `${nowPlaying.band}-${nowPlaying.name}` }</MusicTitle>
          <div>
            <MusicImage src={ !nowPlaying.image ? DEFAULT_IMAGE : nowPlaying.image } className="playing-image" />
          </div>
          <MusicButton onClick={() => getNowPlaying()}>
            Check Now Playing
          </MusicButton>
          {nowPlaying.band != '' ? 
            <MusicButton onClick={() => openChat()}>Message</MusicButton>
            : null
          }
        </PlayerContainer>
        <SimilarContainer className="page-center">
          <h2>{similar.name}</h2>
          <img src={ similar.image } style={{ width: 100 }} />
          <button onClick={() => foundSimilarArtists(nowPlaying.band)}>Similar</button>
        </SimilarContainer>
        {list && 
          list.map((u, i) => {
            //if (u != user.name) {
              return <button key={i} onClick={() => handleChatClick(u)}>{u}</button>
            //}
            //return null
          })
        }
      </Container>
    )
  } else {
    return (
      <LoginContainer image={require('../../assets/login.svg')} >
        <LoginLogo src={logoImg} alt="LogoImg" />
        <a style={{ textDecoration: 'none' }} href="http://localhost:8888">
          <LoginButton className="login-btn">
            <LoginImage src={require('../../assets/spotify-brands.svg')}/>
            <LoginText>Login with spotify</LoginText>
          </LoginButton>
        </a>
      </LoginContainer>
    );
  }
}

export default HomePage;
