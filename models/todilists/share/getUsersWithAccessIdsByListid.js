const pool = require("../../DBconnection");

const getUsersWithAccessIdsByListid = async (listid) => {
  const res = await pool.query(
    "Select userid FROM lists_sharing_table WHERE listid = $1 ",
    [listid]
  );
  return res.rows.map((i) => i.userid);
};

module.exports = getUsersWithAccessIdsByListid;
