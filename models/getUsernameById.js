const db = require("../DB/db");

const getUsernameById = async (id) => {
  const res = await db.query("SELECT username FROM users WHERE id = $1", [id]);
  return res.rows[0] ? res.rows[0].username : undefined;
};

module.exports = getUsernameById;
