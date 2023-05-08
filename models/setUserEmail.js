const db = require("../DB/db");

const setUserEmail = async (userID, email) => {
  const res = await db.query("UPDATE  users SET email = $2 WHERE id=$1", [
    userID,
    email,
  ]);
  return res.rows[0];
};

module.exports = setUserEmail;
