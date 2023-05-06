const migrate = require("node-pg-migrate").default;
const db = require("../DB/db");

const options = {
  direction: "down",
  migrationsTable: "migrations",
  singleTransaction: true,
  checkOrder: true,
  dbClient: db,
  dir: "DB/migrations",
};

if (require.main === module) {
  migrate(options).then((d) => {
    db.end();
  });
}

module.exports = async () => {
  return migrate(options);
};
