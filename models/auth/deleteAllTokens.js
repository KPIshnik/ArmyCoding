const db = require("./../../DB/db");

const deleteAllTokens = async (userid) => {
  const res = await db.query("DELETE FROM refreshtokens where userid = $1 ", [
    userid,
  ]);
};

module.exports = deleteAllTokens;
