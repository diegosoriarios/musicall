"use client";
import NavBar from "@/components/navbar";
import HomePage from "@/pages/home";
import Login from "@/pages/login";
import { ParamsType, selectAuthState, selectParams, setAuthState, setParams } from "@/store/authSlice";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spotify from "spotify-web-api-js";

const spotifyWebApi = new Spotify();

export default function Home() {
  //const [params, setParams] = useState(getHashParams());
  //const [loggedIn, setLoggedIn] = useState(params.access_token ? true : false);
  const [user, setUser] = useState({});
  const [selected, setSelected] = useState("explore");

  const loggedIn = useSelector(selectAuthState);
  const params: ParamsType = useSelector(selectParams);
  const dispatch = useDispatch();

  useEffect(() => {
    let cacheParams = JSON.parse(localStorage.getItem("spotify-params"));
    console.log(cacheParams);
    if (cacheParams) {
      dispatch(setParams(cacheParams))
      dispatch(setAuthState(cacheParams.access_token ? true : false))
      spotifyWebApi.setAccessToken(cacheParams.access_token);
      setUser({
        name: cacheParams.name,
        email: cacheParams.email,
        image: cacheParams.image,
      });
    }
    if (params.access_token) {
      spotifyWebApi.setAccessToken(params.access_token);
      localStorage.setItem("params", JSON.stringify(params));
    }
  }, []);

  if (!loggedIn) return <Login />;

  return (
    <>
      <HomePage
        spotifyWebApi={spotifyWebApi}
        params={params}
        setProfileUser={setUser}
      />
    </>
  );
}
