const db = require("../../../DB/db");

const unshareListWithAllUsers = async (listid) => {
  await db.query("DELETE FROM lists_sharing_table where listid= $1", [listid]);
};

module.exports = unshareListWithAllUsers;
