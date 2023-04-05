const db = require("../DB/db");

const getUserById = async (id) => {
  const res = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return res.rows[0];
};

module.exports = getUserById;
