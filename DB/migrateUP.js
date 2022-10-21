const migrate = require("node-pg-migrate").default;
const db = require("../models/DBconnection");

const options = {
  direction: "up",
  migrationsTable: "migrations",
  singleTransaction: true,
  checkOrder: true,
  dbClient: db,
  dir: "DB/migrations",
};

module.exports = async () => {
  return migrate(options);
};
