import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:8888');

function newMusic(data) {
    socket.emit("new-music", data)
}
function subscribeToTimer(cb) {
  socket.on('timer', timestamp => cb(null, timestamp));
  socket.emit('subscribeToTimer', 1000);
}
export { subscribeToTimer, newMusic };