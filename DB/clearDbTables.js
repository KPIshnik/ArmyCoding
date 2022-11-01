const db = require("../models/DBconnection");

const clearDbTables = async () => {
  await db.query("DELETE FROM users;");
  await db.query("DELETE FROM emailconfirm;");
};

if (require.main === module) {
  console.log("Aloha");
  clearDbTables().then((d) => {
    db.end();
  });
}

module.exports = clearDbTables;
