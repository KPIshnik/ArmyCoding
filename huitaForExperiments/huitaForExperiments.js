const superagent = require("superagent");

const f = (data) =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(console.log(data)), 1000);
  });

const arr = [1, 2, 3];

(async () => {
  arr.forEach(async (e) => {
    await f(e);
  });
  console.log("AAA");
})();
// &timestamp_from=${Date.now()}
//
//const pool = require("../models/DBconnection");

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
