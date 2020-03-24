
exports.up = function(knex) {
    return knex.schema.createTable('posts', table => {
        table.increments()
        table.string('content').notNullable()
        table.integer('likes').notNullable()
        table.date('created_at').notNullable()
        table.string('user_id').notNullable()

        table.foreign('user_id').references('id').inTable('user')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('posts')  
};
