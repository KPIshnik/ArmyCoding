const db = require("./../DB/db");

const getEmailConfirmDataById = async (id) => {
  const res = await db.query("SELECT * FROM emailconfirm WHERE id = $1", [id]);

  return res.rows[0];
};

module.exports = getEmailConfirmDataById;
