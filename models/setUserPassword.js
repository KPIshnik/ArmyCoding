const pool = require("./DBconnection");

const seUserPass = async (userID, hashedPass) => {
  const client = await pool.connect();
  try {
    const res = await client.query(
      "UPDATE  users SET password = $2 WHERE id=$1;",
      [userID, hashedPass]
    );
   return true;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = seUserPass;
