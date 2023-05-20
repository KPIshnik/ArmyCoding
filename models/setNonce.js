const db = require("../DB/db");

const setNonce = async (nonce) => {
  await db.query("INSERT INTO  nonce VALUES($1)", [nonce]);
};

module.exports = setNonce;
