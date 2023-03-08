const pool = require("../DBconnection");

const createTodos = async (listId, todos) => {
  if (!todos.length) return;

  let query = "INSERT INTO todos(listId, text, rank, done )  VALUES  ";

  const paramArr = [];

  todos.forEach((todo, i) => {
    const { text, rank, done } = todo;
    query +=
      "(" +
      `$${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4}` +
      "),\n";
    paramArr.push(listId, text, rank, done);
  });

  const queryStr = query.slice(0, -2) + "RETURNING id";

  const res = await pool.query(queryStr, paramArr);
  return res.rows;
};

module.exports = createTodos;
