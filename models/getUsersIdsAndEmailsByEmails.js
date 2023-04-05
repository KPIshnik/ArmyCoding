const db = require("../DB/db");

const getUsersIdsAndEmailsByEmails = async (emails) => {
  const res = await db.query(
    "SELECT id, email FROM users WHERE email = any ($1)",
    [emails]
  );
  return res.rows;
};

module.exports = getUsersIdsAndEmailsByEmails;
