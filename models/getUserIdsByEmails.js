const pool = require("./DBconnection");

const getUsersIdsByEmails = async (emails) => {
  const res = await pool.query("SELECT id FROM users WHERE email = any ($1)", [
    emails,
  ]);
  return res.rows.map((u) => u.id);
};

module.exports = getUsersIdsByEmails;
