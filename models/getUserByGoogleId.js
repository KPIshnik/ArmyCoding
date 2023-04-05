const db = require("../DB/db");

const getUserByGoogleId = async (googleId) => {
  const res = await db.query("SELECT * FROM users WHERE googleid = $1", [
    googleId,
  ]);
  return res.rows[0];
};

module.exports = getUserByGoogleId;
