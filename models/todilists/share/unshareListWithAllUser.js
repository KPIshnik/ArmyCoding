const pool = require("../../DBconnection");

const unshareListWithAllUsers = async (listid) => {
  await pool.query("DELETE FROM lists_sharing_table where listid= $1", [
    listid,
  ]);
};

module.exports = unshareListWithAllUsers;
