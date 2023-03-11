const pool = require("./DBconnection");

const getUserByUserName = async (username) => {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    return res.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = getUserByUserName;
