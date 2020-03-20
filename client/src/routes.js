import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import Spotify from 'spotify-web-api-js'
import HomePage from './pages/HomePage';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import { Navbar, NavbarItem } from './style'

const spotifyWebApi = new Spotify()

export default function App() {

    const [params, setParams] = useState(getHashParams())
    const [loggedIn, setLoggedIn] = useState(params.access_token ? true : false)
    const [chats, setChats] = useState([])
    const [user, setUser] = useState({})

    useEffect(() => {
        if (params.access_token) {
            spotifyWebApi.setAccessToken(params.access_token)
        }
    }, [])

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
        <Navbar>
          <NavbarItem>
            <Link style={{ textDecoration: 'none' }} to="/">Home</Link>
          </NavbarItem>
          <NavbarItem>
            <Link style={{ textDecoration: 'none' }} to="/profile">Profile</Link>
          </NavbarItem>
          <NavbarItem>
            <Link style={{ textDecoration: 'none' }} to="/topics">Topics</Link>
          </NavbarItem>
          <NavbarItem>
            <Link style={{ textDecoration: 'none' }} to="/chat">Chat</Link>
          </NavbarItem>
        </Navbar>

        <Switch>
          <Route path="/profile">
            <Profile user={user} />
          </Route>
          <Route path="/topics">
            <Topics />
          </Route>
          <Route path="/chat">
            <Chat chats={chats} />
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

function Topics() {
  let match = useRouteMatch();

  return (
    <div>
      <h2>Topics</h2>

      <ul>
        <li>
          <Link to={`${match.url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${match.url}/props-v-state`}>
            Props v. State
          </Link>
        </li>
      </ul>

      {/* The Topics page has its own <Switch> with more routes
          that build on the /topics URL path. You can think of the
          2nd <Route> here as an "index" page for all topics, or
          the page that is shown when no topic is selected */}
      <Switch>
        <Route path={`${match.path}/:topicId`}>
          <Topic />
        </Route>
        <Route path={match.path}>
          <h3>Please select a topic.</h3>
        </Route>
      </Switch>
    </div>
  );
}

function Topic() {
  let { topicId } = useParams();
  return <h3>Requested topic ID: {topicId}</h3>;
}