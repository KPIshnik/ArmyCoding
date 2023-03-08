const todos = [{ rank: 100 }, { rank: 200 }, { rank: 300 }];

const priority = 2;

const rank =
  priority === 1
    ? todos[0].rank / 2
    : priority > todos.length
    ? todos[todos.length - 1].rank + 100
    : (todos[priority - 1].rank + todos[priority - 2].rank) / 2;

console.log(rank);

// const pool = require("../models/DBconnection");

// const createHuinya = async () => {
//   await pool.query("CREATE  table if not exists test(name varchar);");
// };

// const clearHuinya = async () => {
//   await pool.query("DROP TABLE test;");
// };

// const insertHuita = async (x, y) => {
//   return await pool.query(
//     "INSERT INTO test(name)  VALUES( $1 ), ($2) returning name",
//     [x, y]
//   );
// };

// createHuinya().then(() => {
//   insertHuita("a", "b").then((res) => {
//     console.log(res);
//   });
// });

// const getHuita = async (n) => {
//   const res = await pool.query("SELECT name FROM test WHERE name = $1", [n]);

//   return res.rows[0].name;
// };

// const insertMultipleHuita = async (arr) => {
//   const queryArr = [];
//   arr.forEach(async (name) => {
//     queryArr.push(insertHuita(name));
//   });

//   await Promise.all(queryArr);
// };

// exports.clearHuinya = clearHuinya;
// exports.insertMultipleHuita = insertMultipleHuita;
// exports.getHuita = getHuita;
// exports.createHuinya = createHuinya;
