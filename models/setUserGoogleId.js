const db = require("../DB/db");

const setUserGoogleid = async (userid, googleid) => {
  const res = await db.query("UPDATE  users SET googleid = $2 WHERE id=$1", [
    userid,
    googleid,
  ]);
  return res.rows[0];
};

module.exports = setUserGoogleid;
