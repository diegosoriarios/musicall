const express = require('express')

const userController = require('./controller/UserController')
const postController = require('./controller/PostsController')

const routes = express.Router()

routes.get('/users', userController.index)
routes.post('/users', userController.create)

routes.get('/posts', postController.index)
routes.post('/posts', postController.create)
routes.delete('/posts/:id', postController.delete)

module.exports = routes