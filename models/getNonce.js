const db = require("../DB/db");

const getNonce = async (nonce) => {
  const res = await db.query(
    "DELETE FROM nonce WHERE nonce = $1 RETURNING nonce",
    [nonce]
  );

  return res.rows[0] && res.rows[0].nonce;
};

module.exports = getNonce;
