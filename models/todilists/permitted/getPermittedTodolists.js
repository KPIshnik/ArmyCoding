const pool = require("../../DBconnection");

const getPermittedTodolists = async (userid) => {
  const res = await pool.query(
    "Select listid, listname FROM lists_sharing_table WHERE userid = $1 ORDER BY listname ",
    [userid]
  );
  return res.rows;
};

module.exports = getPermittedTodolists;
