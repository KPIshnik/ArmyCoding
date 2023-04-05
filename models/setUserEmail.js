const db = require("../DB/db");

const setUserEmail = async (userID, email) => {
  await db.query("UPDATE  users SET email = $2 WHERE id=$1;", [userID, email]);
};

module.exports = setUserEmail;
