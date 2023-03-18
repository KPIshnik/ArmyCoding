const pool = require("../../DBconnection");

const isUserHaveAccesToList = async (userid, listid) => {
  const res = await pool.query(
    "Select listname FROM lists_sharing_table WHERE userid = $1 and listid=$2 ",
    [userid, listid]
  );
  return res.rows[0] ? true : false;
};

module.exports = isUserHaveAccesToList;
