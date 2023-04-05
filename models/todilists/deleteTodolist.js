const pool = require("../../DB/db");

const deleteTodoList = async (id) => {
  client = await pool.connect();

  const res = await client.query(
    "DELETE FROM lists where id = $1 returning listname",
    [id]
  );

  client.release();
  return res.rows[0];
};

module.exports = deleteTodoList;
