const db = require("../DB/db");

const setUserName = async (userID, username) => {
  const res = await db.query("UPDATE  users SET username = $2 WHERE id=$1;", [
    userID,
    username,
  ]);
  return true;
};

module.exports = setUserName;
