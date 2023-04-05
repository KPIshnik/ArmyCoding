const db = require("../DB/db");

const getUserByEmail = async (email) => {
  const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return res.rows[0];
};

module.exports = getUserByEmail;
