const db = require("./../../DB/db");

const addToken = async (userid, token, deviceid) => {
  const res = await db.query(
    "INSERT INTO refreshtokens(userid, refreshtoken, deviceid) VALUES ($1, $2, $3)",
    [userid, token, deviceid]
  );
};

module.exports = addToken;
