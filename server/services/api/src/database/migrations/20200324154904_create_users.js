
exports.up = function(knex) {
    return knex.schema.createTable('user', table => {
        table.string('id').primary()
        table.string('username').notNullable()
        table.string('email').notNullable()
        table.string('avatar').notNullable()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('ongs')
};
