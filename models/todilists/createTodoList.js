const pool = require("../DBconnection");

const createTodoList = async (userid, listname, date) => {
  client = await pool.connect();

  const res = await client.query(
    "INSERT INTO lists(owner_id, listname, updated_at )  VALUES( $1, $2, $3 ) returning id",
    [userid, listname, date]
  );

  const listId = res.rows[0].id;

  client.release();
  return listId;
};

module.exports = createTodoList;
