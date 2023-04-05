const db = require("../../../DB/db");

const unshareTodolist = async (listid, userid) => {
  const res = await db.query(
    "DELETE FROM lists_sharing_table where listid= $1 and userid = $2 returning listname",
    [listid, userid]
  );
  return res.rows[0].listname;
};

module.exports = unshareTodolist;
