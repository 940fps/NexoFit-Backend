const knex = require("knex");

const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
  },
  pool: {
    min: 1,
    max: 3,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
  },
  useNullAsDefault: true,
});

exports.db = db;