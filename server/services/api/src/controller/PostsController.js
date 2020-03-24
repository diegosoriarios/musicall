const connection = require('../database/connection')

module.exports = {
    async index(req, res) {
        const { page = 1} = req.query

        const [count] = await connection('posts').count()

        const posts = await connection('posts')
            .join('user', 'user.id', '=', 'posts.user_id')
            .limit(5)
            .offset((page - 1 * 5))
            .select(['posts.*', 'user.username', 'user.email', 'user.avatar'])
        
        res.header('X-Total-Count', count['count(*)'])

        return res.json(posts)
    },

    async create(req, res) {
        const { content, created_at } = req.body
        const user_id = req.headers.authorization
        const likes = 0

        const [id] = await connection('posts').insert({
            content,
            likes,
            created_at,
            user_id
        })

        return res.json({ id })
    },

    async delete(req, res) {
        const { id } = req.params
        const user_id = req.headers.authorization

        const posts = await connection('posts')
            .where('id', id)
            .select('user_id')
            .first()
        
        if (posts.user_id !== user_id) {
            return res.status(401).json({ error: 'Operation not permitted.' })
        }

        await connection('posts').where('id', id).delete()

        return res.status(204).send()
    }
}