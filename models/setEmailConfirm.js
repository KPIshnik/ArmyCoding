const pool = require("./DBconnection");

const setEmailConfirm = async (userID) => {
  const client = await pool.connect();
  try {
    const res = await client.query(
      "UPDATE  users SET confirmed = $2 WHERE id=$1;",
      [userID, true]
    );
   return true;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = setEmailConfirm;
