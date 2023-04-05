const pool = require("../../DB/db");

const getUserTodoListDataById = async (id) => {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT * FROM lists WHERE id = $1", [id]);
    return res.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = getUserTodoListDataById;
