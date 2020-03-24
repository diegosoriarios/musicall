const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const { addUser, removeUser, getUser, getUsersInRoom } = require('./src/models/users.js')


//TODO: Save on Database
io.on('connection', socket => {
    console.log('User has connected')

    socket.on('join', ({name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room })

        if (error) return callback(error)

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}`})
        socket.broadcast.to(user.room).emit("message", { user: 'admin', text: `${user.name}, has joined!`})

        socket.join(user.room)

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('message', { user: user.name, text: message })

        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.`})
        }
    })
})

module.exports = server