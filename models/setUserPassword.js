const db = require("../DB/db");

const setUserPassword = async (userID, hashedPass) => {
  const res = await db.query("UPDATE  users SET password = $2 WHERE id=$1;", [
    userID,
    hashedPass,
  ]);
  return true;
};

module.exports = setUserPassword;
