const { pgTable, serial, varchar, timestamp } = require('drizzle-orm/pg-core');

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  user_name: varchar('user_name', { length: 50 }),
  email: varchar('email', { length: 100 }).notNull(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

const db = require('../configs/db');

async function getProductById(id) {
  const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows[0];
}

module.exports = { users };

