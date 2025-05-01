const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../../.env") });

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "postgres",
    connection: {
      connectionString: process.env.DB_CONNECTION_URI,
    },
    migrations: {
      directory: path.join(__dirname, "./migrations"), // Path to migrations folder
      tableName: "knex_migrations", // Table to track migrations
    },
    seeds: {
      directory: path.join(__dirname, "./seeds"), // Path to seeds folder (optional)
    },
  },
};