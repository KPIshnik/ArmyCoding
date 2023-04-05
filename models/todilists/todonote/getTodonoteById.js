const db = require("../../../DB/db");

const getTodonoteById = async (id) => {
  const res = await db.query("SELECT * FROM todos WHERE (id= $1)", [id]);
  return res.rows[0];
};

module.exports = getTodonoteById;
