const pool = require("./DBconnection");

const checkUniqueUsername = async (userName) => {
  const client = await pool.connect();
  try {
    const res = await client.query(
      "SELECT username FROM users WHERE username = $1",
      [userName]
    );

    return res.rows[0] ? false : true;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = checkUniqueUsername;
