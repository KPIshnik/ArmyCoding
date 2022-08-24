const pool = require("./DBconnection");

const setUserEmail = async (userID, email) => {
  const client = await pool.connect();
  try {
    const res = await client.query(
      "UPDATE  users SET email = $2 WHERE id=$1;",
      [userID, email]
    );
    return true;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = setUserEmail;
