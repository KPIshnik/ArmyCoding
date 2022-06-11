const pool = require("./DBconnection");

const getUserByFacebookId = async (facebookId) => {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT * FROM users WHERE facebookid = $1", [facebookId]);
    return res.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = getUserByFacebookId