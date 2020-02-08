import React, { useState, useEffect } from 'react';
import Spotify from 'spotify-web-api-js'
import './App.css'
import { newMusic } from './services/socket';
import Header from './components/Header';

const spotifyWebApi = new Spotify()
const DEFAULT_IMAGE = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'

function App() {
  const [params, setParams] = useState(getHashParams())
  const [loggedIn, setLoggedIn] = useState(params.access_token ? true : false)
  const [nowPlaying, setNowPlaying] = useState({name: 'Not Checked', image: '', band: ''})
  const [similar, setSimilar] = useState("")

  useEffect(() => {
    if (params.access_token) {
      spotifyWebApi.setAccessToken(params.access_token)
    }
  }, [])

  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  function getNowPlaying() {    
    spotifyWebApi.getMyCurrentPlaybackState()
    .then(response => {
      if(response.item) {
        console.log(response)
        setNowPlaying({
          name: response.item.name,
          image: response.item.album.images[0].url,
          band: response.item.artists[0].name
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


  if (loggedIn) {
    return (
      <div className="App">
        <Header title={'Home'} />
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

export default App;
