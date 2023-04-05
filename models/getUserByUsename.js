const db = require("../DB/db");

const getUserByUserName = async (username) => {
  const res = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return res.rows[0];
};

module.exports = getUserByUserName;
