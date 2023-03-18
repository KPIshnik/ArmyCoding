const pool = require("../../DBconnection");

const shareTodolistWithUsers = async (listid, listname, usersIdArr) => {
  if (!usersIdArr.length) return;

  const paramArr = [];

  let query =
    "INSERT INTO lists_sharing_table(userid, listid, listname )  VALUES ";

  usersIdArr.forEach((userid, i) => {
    query += `( $${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3}),\n`;

    paramArr.push(userid, listid, listname);
  });
  const queryStr = query.slice(0, -2);

  await pool.query(queryStr, paramArr);
};

module.exports = shareTodolistWithUsers;
