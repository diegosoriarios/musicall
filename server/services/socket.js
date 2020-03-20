var app = require('express')()
var http = require('http').createServer(app)
var io = require('socket.io')(http)

exports.socket = io
exports.server = http