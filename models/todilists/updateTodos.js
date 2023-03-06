const pool = require("../DBconnection");

const updateTodos = async (todos) => {
  if (!todos.length) return;

  let queryHead = `
  update todos as t set 
  text = t2.text, 
  rank = t2.rank::int, 
  done = t2.done::boolean 
  from (values\n`;
  const queryEnd = `) as t2(id, text, rank, done ) where t2.id = t.id::text `;
  const paramArr = [];

  todos.forEach((todo, i) => {
    const { id, text, rank, done } = todo;

    queryHead += `( $${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${
      i * 4 + 4
    } ),\n`;

    paramArr.push(id, text, rank, done);
    // await pool.query(
    //   "UPDATE todos SET text = $2, rank= $3, done = $4 WHERE id=$1;",
    //   [id, text, rank, done]
    // );
  });

  let queryStr = queryHead.slice(0, -2);
  queryStr += queryEnd;
  console.log(queryStr);
  console.log(paramArr);

  await pool.query(queryStr, paramArr);
};

module.exports = updateTodos;
