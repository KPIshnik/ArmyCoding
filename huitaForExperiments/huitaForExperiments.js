const pool = require("../models/DBconnection");

const createHuinya = async () => {
  await pool.query("CREATE  table if not exists test(name varchar);");
};

const clearHuinya = async () => {
  await pool.query("DROP table test;");
};

const insertHuita = async (name) => {
  await pool.query("INSERT INTO test(name)  VALUES( $1 )", [name]);
};

const getHuita = async (n = "4") => {
  const res = await pool.query("SELECT name FROM test WHERE name = $1", [n]);

  return res.rows[0].name;
};

const insertMultipleHuita = async () => {
  const arr = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const queryArr = [];
  arr.forEach(async (name) => {
    //queryArr.push(insertHuita(name));
    await insertHuita(name);
  });
  //await Promise.all(queryArr);
};

pool
  .query("DELETE FROM test where  name = any ($1)", [["1", "2"]])
  .then((d) => {
    pool.query("SELECT * FROM test").then((x) => console.log(x));
  });

exports.clearHuinya = clearHuinya;
exports.insertMultipleHuita = insertMultipleHuita;
exports.getHuita = getHuita;
exports.createHuinya = createHuinya;
