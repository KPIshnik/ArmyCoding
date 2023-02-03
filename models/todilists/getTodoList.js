const pool = require("../DBconnection");

const getTodoListS = async (userId, todoId) => {
  const client = await pool.connect();
  try {
    const res = await client.query(
      "SELECT * FROM lists WHERE (owner_id = $1 AND id=$2);",
      [userId, todoId]
    );
    return res.rows;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = getTodoListS;
