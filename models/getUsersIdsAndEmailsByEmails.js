const pool = require("./DBconnection");

const getUsersIdsAndEmailsByEmails = async (emails) => {
  const res = await pool.query(
    "SELECT id, email FROM users WHERE email = any ($1)",
    [emails]
  );
  return res.rows;
};

module.exports = getUsersIdsAndEmailsByEmails;
