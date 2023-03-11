const pool = require("./DBconnection");

const getUsersDataByIds = async (ids) => {
  const res = await pool.query(
    "SELECT id, email, username  FROM users WHERE id = any ($1) ORDER BY email",
    [ids]
  );
  return res.rows;
};

module.exports = getUsersDataByIds;
