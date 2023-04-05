const db = require("./../DB/db");

const checkUniqueUserEmail = async (userEmail) => {
  const res = await db.query("SELECT email FROM users WHERE email = $1", [
    userEmail,
  ]);
  return res.rows[0];
};

module.exports = checkUniqueUserEmail;
