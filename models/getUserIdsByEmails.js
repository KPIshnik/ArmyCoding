const db = require("../DB/db");

const getUsersIdsByEmails = async (emails) => {
  const res = await db.query("SELECT id FROM users WHERE email = any ($1)", [
    emails,
  ]);
  return res.rows.map((u) => u.id);
};

module.exports = getUsersIdsByEmails;
