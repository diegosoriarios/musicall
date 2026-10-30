import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('posts', (table) => {
    table.increments('id').primary()
    table.text('content').notNullable()
    table.integer('likes').notNullable().defaultTo(0)
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.string('user_id').notNullable()

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.index('user_id')
    table.index('created_at')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('posts')
}
