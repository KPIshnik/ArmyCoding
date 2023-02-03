const pool = require("../DBconnection");

const createTodoList = async (userid, listname, todos) => {
  client = await pool.connect();

  const res = await client.query(
    "INSERT INTO lists(owner_id, listname )  VALUES( $1, $2 ) returning id",
    [userid, listname]
  );

  const listId = res.rows[0].id;

  if (!todos) {
    client.release();
    return listId;
  }

  for (let todo of todos) {
    const { text, priority, done } = todo;
    await client.query(
      "INSERT INTO todos(list_id, text, priority, done )  VALUES( $1, $2, $3, $4 ) returning id",
      [listId, text, priority, done]
    );
  }

  client.release();
  return listId;
};

module.exports = createTodoList;
