const db = require("../DB/db");

const getUserDataByKey = async (key) => {
  const res = await db.query("SELECT * FROM emailconfirm WHERE key = $1", [
    key,
  ]);

  return res.rows[0];
};

module.exports = getUserDataByKey;
