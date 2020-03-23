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
var client_secret = '***REMOVED***'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

const socket = require('./services/socket')

const data = [{
  "id": 1,
  "username": "kimpey0",
  "content": "transform leading-edge markets",
  "avatar": "https://robohash.org/doloremillumpossimus.jpg?size=50x50&set=set1",
  "likes": 28,
  "created_at": "6/23/2019"
}, {
  "id": 2,
  "username": "mtansly1",
  "content": "envisioneer proactive systems",
  "avatar": "https://robohash.org/idteneturipsum.bmp?size=50x50&set=set1",
  "likes": 42,
  "created_at": "7/30/2019"
}, {
  "id": 3,
  "username": "ewellman2",
  "content": "productize magnetic networks",
  "avatar": "https://robohash.org/nihilquiid.bmp?size=50x50&set=set1",
  "likes": 61,
  "created_at": "9/14/2019"
}, {
  "id": 4,
  "username": "averrill3",
  "content": "enhance scalable web services",
  "avatar": "https://robohash.org/cupiditatequiasequi.bmp?size=50x50&set=set1",
  "likes": 24,
  "created_at": "6/23/2019"
}, {
  "id": 5,
  "username": "ccardall4",
  "content": "monetize interactive metrics",
  "avatar": "https://robohash.org/sedatomnis.jpg?size=50x50&set=set1",
  "likes": 42,
  "created_at": "3/21/2019"
}, {
  "id": 6,
  "username": "cocorrigane5",
  "content": "morph holistic relationships",
  "avatar": "https://robohash.org/eligendiillorerum.bmp?size=50x50&set=set1",
  "likes": 51,
  "created_at": "4/11/2019"
}, {
  "id": 7,
  "username": "acroxford6",
  "content": "utilize 24/365 supply-chains",
  "avatar": "https://robohash.org/debitisveniamearum.png?size=50x50&set=set1",
  "likes": 78,
  "created_at": "9/15/2019"
}, {
  "id": 8,
  "username": "fchestnut7",
  "content": "facilitate ubiquitous e-commerce",
  "avatar": "https://robohash.org/architectoducimusculpa.jpg?size=50x50&set=set1",
  "likes": 47,
  "created_at": "6/20/2019"
}, {
  "id": 9,
  "username": "cludlamme8",
  "content": "recontextualize innovative communities",
  "avatar": "https://robohash.org/natusmolestiasest.jpg?size=50x50&set=set1",
  "likes": 92,
  "created_at": "10/25/2019"
}, {
  "id": 10,
  "username": "ohatto9",
  "content": "empower bricks-and-clicks portals",
  "avatar": "https://robohash.org/nequerecusandaeasperiores.png?size=50x50&set=set1",
  "likes": 45,
  "created_at": "1/5/2020"
}, {
  "id": 11,
  "username": "nsawdena",
  "content": "integrate turn-key content",
  "avatar": "https://robohash.org/sitevenietut.png?size=50x50&set=set1",
  "likes": 84,
  "created_at": "12/1/2019"
}, {
  "id": 12,
  "username": "bchazelasb",
  "content": "architect ubiquitous e-markets",
  "avatar": "https://robohash.org/faceresuntofficia.bmp?size=50x50&set=set1",
  "likes": 73,
  "created_at": "9/21/2019"
}, {
  "id": 13,
  "username": "glewendonc",
  "content": "deploy interactive interfaces",
  "avatar": "https://robohash.org/fugiatsedvel.bmp?size=50x50&set=set1",
  "likes": 70,
  "created_at": "2/28/2020"
}, {
  "id": 14,
  "username": "lstagged",
  "content": "streamline robust interfaces",
  "avatar": "https://robohash.org/voluptasmollitiaut.bmp?size=50x50&set=set1",
  "likes": 23,
  "created_at": "2/22/2020"
}, {
  "id": 15,
  "username": "dsteffane",
  "content": "expedite seamless communities",
  "avatar": "https://robohash.org/oditullamet.jpg?size=50x50&set=set1",
  "likes": 26,
  "created_at": "2/29/2020"
}, {
  "id": 16,
  "username": "rocannavanf",
  "content": "monetize global e-services",
  "avatar": "https://robohash.org/mollitiaoccaecatiet.bmp?size=50x50&set=set1",
  "likes": 36,
  "created_at": "8/9/2019"
}, {
  "id": 17,
  "username": "doclearyg",
  "content": "e-enable B2C communities",
  "avatar": "https://robohash.org/autvoluptatibusdolore.png?size=50x50&set=set1",
  "likes": 87,
  "created_at": "2/29/2020"
}, {
  "id": 18,
  "username": "aleaskh",
  "content": "target wireless web-readiness",
  "avatar": "https://robohash.org/temporibusetducimus.png?size=50x50&set=set1",
  "likes": 77,
  "created_at": "1/25/2020"
}, {
  "id": 19,
  "username": "ltwiggsi",
  "content": "embrace plug-and-play solutions",
  "avatar": "https://robohash.org/eiusmolestiaeodit.png?size=50x50&set=set1",
  "likes": 46,
  "created_at": "8/4/2019"
}, {
  "id": 20,
  "username": "ujeckellsj",
  "content": "mesh robust infomediaries",
  "avatar": "https://robohash.org/itaqueestfugit.jpg?size=50x50&set=set1",
  "likes": 35,
  "created_at": "12/15/2019"
}, {
  "id": 21,
  "username": "rlopezk",
  "content": "benchmark dynamic synergies",
  "avatar": "https://robohash.org/accusamusmolestiasqui.bmp?size=50x50&set=set1",
  "likes": 90,
  "created_at": "5/4/2019"
}, {
  "id": 22,
  "username": "bkochlinl",
  "content": "redefine one-to-one deliverables",
  "avatar": "https://robohash.org/iustocumnecessitatibus.png?size=50x50&set=set1",
  "likes": 8,
  "created_at": "9/5/2019"
}, {
  "id": 23,
  "username": "mtroppmannm",
  "content": "unleash frictionless initiatives",
  "avatar": "https://robohash.org/nonautdelectus.png?size=50x50&set=set1",
  "likes": 15,
  "created_at": "2/29/2020"
}, {
  "id": 24,
  "username": "cnaultyn",
  "content": "maximize revolutionary models",
  "avatar": "https://robohash.org/debitisassumendanobis.jpg?size=50x50&set=set1",
  "likes": 82,
  "created_at": "5/26/2019"
}, {
  "id": 25,
  "username": "dkerwino",
  "content": "envisioneer open-source infrastructures",
  "avatar": "https://robohash.org/utcupiditateneque.png?size=50x50&set=set1",
  "likes": 12,
  "created_at": "2/8/2020"
}, {
  "id": 26,
  "username": "ghamsherp",
  "content": "aggregate intuitive architectures",
  "avatar": "https://robohash.org/voluptatemliberoodio.jpg?size=50x50&set=set1",
  "likes": 77,
  "created_at": "11/9/2019"
}, {
  "id": 27,
  "username": "dhadrillq",
  "content": "generate 24/365 portals",
  "avatar": "https://robohash.org/autemcupiditateest.jpg?size=50x50&set=set1",
  "likes": 17,
  "created_at": "11/16/2019"
}, {
  "id": 28,
  "username": "clegraver",
  "content": "e-enable next-generation partnerships",
  "avatar": "https://robohash.org/quisunttemporibus.bmp?size=50x50&set=set1",
  "likes": 24,
  "created_at": "7/13/2019"
}, {
  "id": 29,
  "username": "bswains",
  "content": "recontextualize compelling convergence",
  "avatar": "https://robohash.org/doloresquisquamin.bmp?size=50x50&set=set1",
  "likes": 86,
  "created_at": "5/9/2019"
}, {
  "id": 30,
  "username": "swheelant",
  "content": "seize leading-edge supply-chains",
  "avatar": "https://robohash.org/inventoretemporibusoccaecati.jpg?size=50x50&set=set1",
  "likes": 28,
  "created_at": "9/5/2019"
}]


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
app.listen(8888);

let clients = {}

socket.socket.on('connection', (client) => {
  console.log('a user connected');

  client.on("new_music", music => {
    const { band, name, user } = music

    console.log(music)
    
    if (band in clients) {
      if (name in clients[band]) {
        clients[band][name].users = [...clients[band][name].users, user]
      } else {
        clients[band] = {
          [name]: {
            users: [user]
          }
        }
      }
    } else {
      clients = {
        [band]: {
          [name]: {
            users: [user]
          }
        }
      }
    }

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

socket.server.listen(3210, () => {
  console.log('listening on *:3210');
});