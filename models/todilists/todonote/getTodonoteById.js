const pool = require("../../DBconnection");

const getTodonoteById = async (id) => {
  const res = await pool.query("SELECT * FROM todos WHERE (id= $1)", [id]);
  return res.rows[0];
};

module.exports = getTodonoteById;
