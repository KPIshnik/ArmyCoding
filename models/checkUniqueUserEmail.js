const pool = require("./DBconnection");

const checkUniqueUserEmail = async (userEmail) => {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT email FROM users WHERE email = $1", [userEmail]);
    return res.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = checkUniqueUserEmail