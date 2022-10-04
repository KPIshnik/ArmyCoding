const { confirmEmailExpireTime } = require("./configs/settings");
const pool = require("./models/DBconnection");

const deleteUnconfirmedUsers = async () => {
  const client = await pool.connect();
  const expiredDate = Date.now() - confirmEmailExpireTime;

  try {
    const expiredUsers = await client.query(
      "DELETE FROM emailconfirm WHERE date > $1 RETURNING username",
      [expiredDate]
    );

    if (expiredUsers.rowCount != 0) {
      usersToDelete = expiredUsers.rows.map((u) => u.username);

      await client.query("DELETE FROM users WHERE username = any ($1)", [
        usersToDelete,
      ]);
    }

    //return res.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
};

deleteUnconfirmedUsers();

module.exports = deleteUnconfirmedUsers;

// const { confirmEmailExpireTime } = require("./configs/settings");
// const pool = require("./models/DBconnection");

// const deleteUnconfirmedUsers = async () => {
//   const client = await pool.connect();
//   await client.query(
//     "INSERT INTO experiments(username, date)  VALUES( $1,$2 )",
//     ["test1", 0]
//   );

//   await client.query(
//     "INSERT INTO experiments(username, date)  VALUES( $1,$2 )",
//     ["test2", 1]
//   );

//   await client.query(
//     "INSERT INTO experiments(username, date)  VALUES( $1,$2 )",
//     ["test3", 2]
//   );

//   const expiredDate = Date.now() - confirmEmailExpireTime;
//   try {
//     const expiredUsers = await client.query(
//       "DELETE FROM experiments WHERE date = any ($1) ",
//       [[1, 0]]
//     );

//     //usersToDelete = expiredUsers.map((u) => u.username);

//     // await client.query("DELETE * FROM users WHERE username in ??????? $1", [
//     //   usersToDelete,
//     // ]);
//   } catch (err) {
//     console.log(err);
//     throw err;
//   } finally {
//     client.release();
//   }
// };

// deleteUnconfirmedUsers(0);

// module.exports = deleteUnconfirmedUsers;
