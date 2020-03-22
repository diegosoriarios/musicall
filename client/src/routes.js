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
import { Navbar, NavbarItem } from './style'
import { Home, HomeOutlined, Person, PersonOutlined, Explore, ExploreOutlined, Mail, MailOutlined } from '@material-ui/icons';

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
          <NavbarItem>
            <Link style={{ textDecoration: 'none' }} onClick={() => setSelected("home")} to="/feed">
              {
                selected === "home" ?
                  <Home style={{ color: 'black' }} /> :
                  <HomeOutlined style={{ color: 'black' }} />
              }
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link style={{ textDecoration: 'none' }} onClick={() => setSelected("person")} to="/profile">
              {
                selected === "person" ?
                  <Person style={{ color: 'black' }} /> :
                  <PersonOutlined style={{ color: 'black' }} />
              }
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link style={{ textDecoration: 'none' }} onClick={() => setSelected("explore")} to="/">
              {
                selected === "explore" ?
                  <Explore style={{ color: 'black' }} /> :
                  <ExploreOutlined style={{ color: 'black' }} />
              }
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link style={{ textDecoration: 'none' }} onClick={() => setSelected("chat")} to="/chat">
              {
                selected === "chat" ?
                  <Mail style={{ color: 'black' }} /> :
                  <MailOutlined style={{ color: 'black' }} />
              }
            </Link>
          </NavbarItem>
        </Navbar>

        <Switch>
          <Route path="/profile">
            <Profile user={user} loggedIn={loggedIn} logout={logout} />
          </Route>
          <Route path="/feed">
            <Feed loggedIn={loggedIn} />
          </Route>
          <Route path="/chat">
            <Chat chats={chats} loggedIn={loggedIn} />
          </Route>
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