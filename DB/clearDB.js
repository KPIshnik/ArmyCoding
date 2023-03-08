const migrate = require("node-pg-migrate").default;
const db = require("../models/DBconnection");
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

if (require.main === module) {
  console.log("Aloha");
  migrate(options).then((d) => {
    db.end();
  });
}

module.exports = async () => {
  await migrate(options);
};
