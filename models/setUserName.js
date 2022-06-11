const pool = require("./DBconnection");

const seUserName = async (userID, username) => {
  const client = await pool.connect();
  try {
    const res = await client.query(
      "UPDATE  users SET username = $2 WHERE id=$1;",
      [userID, username]
    );
   return true;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = seUserName;
