import React, { useState, useEffect } from 'react';
import Spotify from 'spotify-web-api-js'
import './App.css'
import { newMusic } from './services/socket';

const spotifyWebApi = new Spotify()

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

    let user
    spotifyWebApi.getMe().then(response => console.log(response))

    newMusic({
      band: nowPlaying.band,
      name: nowPlaying.name,
      spotifyWebApi
    })
  }

  async function foundSimilarArtists(artist) {
    let artistId = await spotifyWebApi.searchArtists(artist).then(response => response.artists.items[0].id)

    console.log(artistId)

    return spotifyWebApi.getArtistRelatedArtists(artistId).then(response => {
      console.log(response)
      console.log(response.artists[Math.floor(Math.random() * response.artists.length)])
      setSimilar(response.artists[Math.floor(Math.random() * response.artists.length)].name)
    })
  }

  return (
    <div className="App">
      <a href="http://localhost:8888">
        <button>Login with spotify</button>
      </a>
      <div> Now playing: { `${nowPlaying.band}-${nowPlaying.name}` }</div>
      <div>
        <img src={ nowPlaying.image } style={{ width: 100 }} />
      </div>
      <button onClick={() => getNowPlaying()}>
        Check Now Playing
      </button>
      <h2>{similar}</h2>
      <button onClick={() => foundSimilarArtists(nowPlaying.band)}>Similar</button>
    </div>
  );
}

export default App;
