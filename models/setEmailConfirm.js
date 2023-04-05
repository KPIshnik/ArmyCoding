const db = require("./../DB/db");

const setEmailConfirm = async (userID) => {
  const res = await db.query("UPDATE  users SET confirmed = $2 WHERE id=$1;", [
    userID,
    true,
  ]);
  return true;
};

module.exports = setEmailConfirm;
