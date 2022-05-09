const pool = require("./DBconnection");

const getUserById = async (id) => {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT * FROM users WHERE id = $1", [id]);
    return res.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = getUserById;
