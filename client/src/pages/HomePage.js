import React, { useState, useEffect } from 'react';
//import Spotify from 'spotify-web-api-js'
import '../App.css'
import openSocket from 'socket.io-client'
import Chat from '../pages/Chat';
import { useHistory } from "react-router-dom";


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

  /*function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }*/

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
    history.push('/chat')
  }

  if (loggedIn) {
    return (
      <div className="App">
        <div className="page-header">
          <div> Now playing: { `${nowPlaying.band}-${nowPlaying.name}` }</div>
          <div>
            <img src={ !nowPlaying.image ? DEFAULT_IMAGE : nowPlaying.image } className="playing-image" />
          </div>
          <button onClick={() => getNowPlaying()}>
            Check Now Playing
          </button>
        </div>
        <div className="page-center">
          <h2>{similar.name}</h2>
          <img src={ similar.image } style={{ width: 100 }} />
          <button onClick={() => foundSimilarArtists(nowPlaying.band)}>Similar</button>
        </div>
        {list && 
          list.map((u, i) => {
            //if (u != user.name) {
              return <button key={i} onClick={() => handleChatClick(u)}>{u}</button>
            //}
            //return null
          })
        }
      </div>
    )
  } else {
    return (
      <div className="App">
        <a href="http://localhost:8888">
          <button className="login-btn">Login with spotify</button>
        </a>
      </div>
    );
  }
}

export default HomePage;
