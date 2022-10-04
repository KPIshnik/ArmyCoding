const { confirmEmailExpireTime } = require("../configs/settings");
const pool = require("../models/DBconnection");

const deleteUnconfirmedUsers = async (expiredDate) => {
  const client = await pool.connect();

  try {
    const expiredUsers = await client.query(
      "DELETE FROM emailconfirm WHERE date < $1 RETURNING username",
      [expiredDate]
    );

    if (expiredUsers.rowCount != 0) {
      usersToDelete = expiredUsers.rows.map((u) => u.username);

      await client.query("DELETE FROM users WHERE username = any ($1)", [
        usersToDelete,
      ]);
      return usersToDelete;
    }
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = deleteUnconfirmedUsers;
