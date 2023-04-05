const db = require("../DB/db");

const checkUniqueUsername = async (username) => {
  const res = await db.query("SELECT username FROM users WHERE username = $1", [
    username,
  ]);

  return res.rows[0] ? false : true;
};

module.exports = checkUniqueUsername;
