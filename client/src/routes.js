import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  Redirect
} from "react-router-dom";
import Spotify from 'spotify-web-api-js'
import HomePage from './pages/HomePage';
import Chat from './pages/Chat/';
import Profile from './pages/Profile/';
import Feed from './pages/Feed/';
import { IconImage, Navbar, NavbarIcons, NavbarItem, NavbarHeader, HeaderText, LinkText } from './style'
import ChatPage from './components/ChatPage/index';

const spotifyWebApi = new Spotify()

export default function App() {

    const [params, setParams] = useState(getHashParams())
    const [loggedIn, setLoggedIn] = useState(params.access_token ? true : false)
    const [chats, setChats] = useState([])
    const [user, setUser] = useState({})
    const [selected, setSelected] = useState("explore")

    useEffect(() => {
      let cacheParams = JSON.parse(localStorage.getItem("params"))
      if (cacheParams) {
        setParams(cacheParams)
        setLoggedIn(cacheParams.access_token ? true : false)
        spotifyWebApi.setAccessToken(cacheParams.access_token)
        setUser({
          name: cacheParams.name,
          email: cacheParams.email,
          image: cacheParams.image
        })
      }
      if (params.access_token) {
        spotifyWebApi.setAccessToken(params.access_token)
        localStorage.setItem("params", JSON.stringify(params))
      }
    }, [])

    function logout() {
      localStorage.removeItem("params")
      setLoggedIn(false)
      setParams(false)
    }

    function addUserToChat(user) {
        console.log(user)
        setChats([...chats, user])
    }

    function getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while ( e = r.exec(q)) {
           hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }
    

  return (
    <Router>
      <div style={{ margin: 0 }}>
        <Navbar display={loggedIn ? 'flex' : 'none'}>
          <NavbarHeader>
            <IconImage src={require('./assets/icon.png')} alt="icon" />
            <HeaderText>Musicall</HeaderText>
          </NavbarHeader>
          <NavbarIcons>
            <NavbarItem>
              <Link style={{ textDecoration: "none" }} onClick={() => setSelected("home")} to="/feed">
                <LinkText selected={selected == "home"}>Home</LinkText>
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link style={{ textDecoration: "none" }} onClick={() => setSelected("person")} to="/profile">
                <LinkText selected={selected == "person"}>Profile</LinkText>
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link style={{ textDecoration: "none" }} onClick={() => setSelected("explore")} to="/">
                <LinkText selected={selected == "explore"}>Listening</LinkText>
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link style={{ textDecoration: "none" }} onClick={() => setSelected("chat")} to="/chats">
                <LinkText selected={selected == "chat"}>messages</LinkText>
              </Link>
            </NavbarItem>
          </NavbarIcons>
        </Navbar>

        <Switch>
          <Route path="/profile">
            <Profile user={user} loggedIn={loggedIn} logout={logout} />
          </Route>
          <Route path="/feed">
            <Feed loggedIn={loggedIn} user={user} />
          </Route>
          <Route path="/chats">
            <Chat chats={chats} loggedIn={loggedIn} />
          </Route>
          <Route path="/chat" component={ChatPage} />
          <Route path="/">
            <HomePage 
                spotifyWebApi={spotifyWebApi} 
                params={params} 
                loggedIn={loggedIn} 
                addUserToChat={addUserToChat}
                setProfileUser={setUser}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}