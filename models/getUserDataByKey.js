const pool = require("./DBconnection");

const getUserDataByKey = async (key) => {
  const client = await pool.connect();

  const res = await client.query("SELECT * FROM emailconfirm WHERE key = $1", [
    key,
  ]);
  client.release();
  return res.rows[0];
};

module.exports = getUserDataByKey;
