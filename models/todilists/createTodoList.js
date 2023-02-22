const pool = require("../DBconnection");

const createTodoList = async (userid, listname, todos, date) => {
  client = await pool.connect();

  const res = await client.query(
    "INSERT INTO lists(owner_id, listname, updated_at )  VALUES( $1, $2, $3 ) returning id",
    [userid, listname, date]
  );

  const listId = res.rows[0].id;

  if (!todos) {
    client.release();
    return listId;
  }

  let i = 0;
  for (let todo of todos) {
    const { text, rank, done } = todo;

    await client.query(
      "INSERT INTO todos(list_id, text, rank, done )  VALUES( $1, $2, $3, $4 )",
      [listId, text, rank, done]
    );
  }

  client.release();
  return listId;
};

module.exports = createTodoList;
