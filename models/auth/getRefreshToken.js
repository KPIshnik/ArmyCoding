const db = require("./../../DB/db");

const getRefreshToken = async (deviceid) => {
  const res = await db.query(
    "SELECT refreshtoken FROM refreshtokens where deviceid = $1",
    [deviceid]
  );
  return res.rows[0] ? res.rows[0].refreshtoken : undefined;
};

module.exports = getRefreshToken;
