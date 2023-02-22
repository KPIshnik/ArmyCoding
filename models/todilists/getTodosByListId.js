const pool = require("../DBconnection");

const getTodosByListId = async (listId) => {
  const client = await pool.connect();
  try {
    const res = await client.query(
      "SELECT * FROM todos WHERE (list_id = $1) ORDER by rank;",
      [listId]
    );
    return res.rows;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = getTodosByListId;
