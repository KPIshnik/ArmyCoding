const pool = require("./DBconnection");

const getUserByGoogleId = async (googleId) => {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT * FROM users WHERE googleid = $1", [googleId]);
    return res.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = getUserByGoogleId