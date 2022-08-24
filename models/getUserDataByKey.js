const pool = require("./DBconnection");

const getUserByEmail = async (key) => {
  const client = await pool.connect();
  try {
    const res = await client.query(
      "SELECT * FROM emailconfirm WHERE key = $1",
      [key]
    );
    return res.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = getUserByEmail;
