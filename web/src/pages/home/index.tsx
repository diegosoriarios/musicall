import React, { useState, useEffect } from "react";
import "./styles.scss";
import NavBar from "@/components/navbar";
//import Spotify from 'spotify-web-api-js'

//const spotifyWebApi = new Spotify()
const DEFAULT_IMAGE =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

function HomePage({ spotifyWebApi, params, setProfileUser }) {
  //const [params, setParams] = useState(getHashParams())
  //console.log(params)
  //const [loggedIn, setLoggedIn] = useState(params.access_token ? true : false)
  const [nowPlaying, setNowPlaying] = useState({
    name: "Not Checked",
    image: "",
    band: "",
    bandImage: DEFAULT_IMAGE,
  });
  const [similar, setSimilar] = useState("");
  const [list, setList] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    if (params.access_token) {
      spotifyWebApi.setAccessToken(params.access_token);
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
      image: params.image,
    });
    setProfileUser({
      name: params.name,
      email: params.email,
      image: params.image,
    });
  }, []);

  useEffect(() => {
    getNowPlaying();
  }, [user]);

  async function getNowPlaying() {
    const playbackState = await spotifyWebApi.getMyCurrentPlaybackState();

    const artist = await spotifyWebApi.getArtist(
      playbackState.item?.artists[0].id
    );

    console.log(artist.images);

    setNowPlaying({
      name: playbackState.item.name,
      image: playbackState.item.album.images[0].url,
      band: playbackState.item.artists[0].name,
      bandImage: artist.images[0].url,
    });

    //let user
    //spotifyWebApi.getMe().then(response => console.log(response))

    /*newMusic({
      band: nowPlaying.band,
      name: nowPlaying.name,
      spotifyWebApi
    })*/
  }

  async function foundSimilarArtists(artist) {
    let artistId = await spotifyWebApi
      .searchArtists(artist)
      .then((response) => response.artists.items[0].id);

    console.log(artistId);

    return spotifyWebApi.getArtistRelatedArtists(artistId).then((response) => {
      let random = Math.floor(Math.random() * response.artists.length);
      console.log(response.artists[random]);
      setSimilar({
        name: response.artists[random].name,
        image: response.artists[random].images[0].url,
      });
    });
  }

  return (
    <NavBar>
      <div className="home-container">
        <div
          className="player-container"
          style={{
            backgroundImage: `url(${nowPlaying?.image})`,
          }}
        >
          <h1 className="music-title">
            {" "}
            Now playing: {`${nowPlaying.band}-${nowPlaying.name}`}
          </h1>
          <div>
            <img
              className="music-image"
              src={!nowPlaying.image ? DEFAULT_IMAGE : nowPlaying?.bandImage}
              className="music-image"
            />
          </div>
          <button className="music-button" onClick={() => getNowPlaying()}>
            Check Now Playing
          </button>
          {nowPlaying.band != "" ? (
            <button className="music-button" onClick={() => {}}>
              Message
            </button>
          ) : null}
        </div>
        <div className="similar-content page-center">
          <h2>{similar.name}</h2>
          <img src={similar.image} style={{ width: 100 }} />
          <button onClick={() => foundSimilarArtists(nowPlaying.band)}>
            Similar
          </button>
        </div>
        {list &&
          list?.map((u, i) => {
            //if (u != user.name) {
            return (
              <button key={i} onClick={() => {}}>
                {u}
              </button>
            );
            //}
            //return null
          })}
      </div>
    </NavBar>
  );
}

export default HomePage;
