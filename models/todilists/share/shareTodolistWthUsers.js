const pool = require("../../DBconnection");

const shareTodolistWithUsers = async (listid, usersIdArr) => {
  if (!usersIdArr.length) return;

  const paramArr = [];

  let query = "INSERT INTO lists_sharing_table(userid, listid )  VALUES ";

  usersIdArr.forEach((userid, i) => {
    query += `( $${i * 2 + 1}, $${i * 2 + 2}),\n`;

    paramArr.push(userid, listid);
  });
  const queryStr = query.slice(0, -2);

  await pool.query(queryStr, paramArr);
  //   const res = await pool.query(
  //     "INSERT INTO lists_sharing_table(userid, listid )  VALUES( $1, $2, )",
  //     [userid, listid]);
};

module.exports = shareTodolistWithUsers;
