const db = require("./../../DB/db");

const updateRefreshToken = async (refreshtoken, deviceid) => {
  const res = await db.query(
    "UPDATE refreshtokens SET refreshtoken =$1 where deviceid = $2",
    [refreshtoken, deviceid]
  );
  return res.rows[0] ? res.rows[0].refreshtoken : undefined;
};

module.exports = updateRefreshToken;
