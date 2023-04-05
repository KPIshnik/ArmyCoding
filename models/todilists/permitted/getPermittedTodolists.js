const db = require("../../../DB/db");

const getPermittedTodolists = async (userid) => {
  const res = await db.query(
    "Select listid, listname FROM lists_sharing_table WHERE userid = $1 ORDER BY listname ",
    [userid]
  );
  return res.rows;
};

module.exports = getPermittedTodolists;
