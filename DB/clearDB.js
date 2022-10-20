const migrate = require("node-pg-migrate").default;
const db = require("./db");
const fs = require("fs");

const count = fs.readdirSync(`${__dirname}/migrations`).length;

const options = {
  direction: "down",
  count,
  migrationsTable: "migrations",
  singleTransaction: true,
  checkOrder: true,
  dbClient: db,
  dir: "DB/migrations",
};

module.exports = () => {
  migrate(options);
};
