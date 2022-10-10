const pool = require("./DBconnection");

const setUserEmail = async (userID, email) => {
  const client = await pool.connect();

  await client.query("UPDATE  users SET email = $2 WHERE id=$1;", [
    userID,
    email,
  ]);

  client.release();
};

module.exports = setUserEmail;
