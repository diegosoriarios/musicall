/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')

var client_id = '5a39fb6186e0447d9338e753de6feb9e'; // Your client id
var client_secret = '2d2d0ce76fa04b329e070226c7362c21'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

const socket = require('./socket')

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser())
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: true }))

app.get('/feed', (req, res) => {
  res.json(data)
})

app.post('/feed', (req, res) => {
  data.push(req.body)
})
  
app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-read-playback-state user-read-currently-playing';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);

          res.redirect('http://localhost:3000/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token,
            name: body.display_name,
            email: body.email,
            image: body.images[0].url,
          }))
        });

        // we can also pass the token to the browser to make requests from there
        /*res.redirect('http://localhost:3000/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token,
            name: name,
            email: email,
            image: image
          }));*/
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

console.log('Listening on 8888');
//app.listen(8888);

let clients = {}

const userAlreadyOnList = (band, name, user) => clients && clients[band] && clients[band][name] && clients[band][name].users.includes(user)

socket.socket.on('connection', (client) => {
  console.log('LOGIN - a user connected');

  client.on("new_music", music => {
    const { band, name, user } = music
    
    if (band in clients) {
      if (name in clients[band]) {
        if (!user) return;
        if (!userAlreadyOnList(band, name, user))
          clients[band][name].users = [...clients[band][name].users, user]
      } else {
        if (!user) return;
        if (!userAlreadyOnList(band, name, user))
          clients[band] = {
            [name]: {
              users: [user]
            }
          }
      }
    } else {
      if (!user) return;
      if (!userAlreadyOnList(band, name, user))
        clients = {
          [band]: {
            [name]: {
              users: [user]
            }
          }
        }
    }

    console.log(clients[band][name])

    client.emit('update_list', clients)
  })

  client.on('subscribe', function(room) {
    console.log('joining room', room);
    socket.join(room);
  });

  client.on('send message', function(data) {
    console.log('sending room post', data.room);
    socket.broadcast.to(data.room).emit('conversation private post', {
        message: data.message
    });
  });
})

//socket.server.listen(3210, () => {
//  console.log('listening on *:3210');
//});

module.exports = {
  app,
  socket
}