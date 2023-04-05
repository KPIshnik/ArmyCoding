const db = require("../DB/db");

const getUserByFacebookId = async (facebookId) => {
  const res = await db.query("SELECT * FROM users WHERE facebookid = $1", [
    facebookId,
  ]);
  return res.rows[0];
};

module.exports = getUserByFacebookId;
