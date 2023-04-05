const db = require("../DB/db");

const deleteUnconfirmedUsers = async (expiredDate) => {
  const expiredUsers = await db.query(
    "DELETE FROM emailconfirm WHERE date < $1 RETURNING id",
    [expiredDate]
  );

  if (expiredUsers.rowCount != 0) {
    usersToDelete = expiredUsers.rows.map((u) => u.id);

    await db.query("DELETE FROM users WHERE id = any ($1)", [[usersToDelete]]);
    return usersToDelete;
  }
};

module.exports = deleteUnconfirmedUsers;
