
const connection = require('../database/connection')
const crypto = require('crypto')

module.exports = {
    async index(req, res) {
        const user = await connection('user').select('*')

        return res.json(user)
    },

    async create(req, res) {
        const { username, email, avatar } = req.body

        const id = crypto.randomBytes(4).toString('HEX')
    
        await connection('user').insert({
            id,
            username,
            email,
            avatar
        })
    
        return res.json({ id })
    }
}