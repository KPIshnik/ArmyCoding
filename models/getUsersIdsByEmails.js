const pool = require("./DBconnection");

const getUsersIdsByEmails = async (emailArr) => {
  const res = await pool.query("SELECT id FROM users WHERE email = any ($1)", [
    emailArr,
  ]);
  return res.rows.map((i) => i.id);
};

module.exports = getUsersIdsByEmails;
