const api = require('./services/api/src/index')
const app = require('./services/login/')
const socketserver = require('./services/chat/')

app.app.listen(8888)
app.socket.server.listen(3210)
api.listen(4710)
socketserver.listen(3847)