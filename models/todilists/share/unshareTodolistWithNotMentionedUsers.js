const db = require("../../../DB/db");

const unshareTodolistWithNotMentionedUsers = async (listid, userids) => {
  const res = await db.query(
    "DELETE FROM lists_sharing_table where listid= $1 and userid <> ALL ($2) returning listname",
    [listid, userids]
  );
  return res.rows[0].listname;
};

module.exports = unshareTodolistWithNotMentionedUsers;
