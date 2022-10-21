const pool = require("./DBconnection");

const getEmailConfirmDataById = async (id) => {
  const client = await pool.connect();

  const res = await client.query("SELECT * FROM emailconfirm WHERE id = $1", [
    id,
  ]);
  client.release();
  return res.rows[0];
};

module.exports = getEmailConfirmDataById;
