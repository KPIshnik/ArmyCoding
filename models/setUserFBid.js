const db = require("../DB/db");

const setUserFacebookId = async (userid, facebookid) => {
  const res = await db.query("UPDATE  users SET facebookid = $2 WHERE id=$1", [
    userid,
    facebookid,
  ]);
  return res.rows[0];
};

module.exports = setUserFacebookId;
