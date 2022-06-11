const pool = require("./DBconnection");

const getUserByUserName = async (userName) => {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT * FROM users WHERE username = $1", [userName]);
    return res.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = getUserByUserName