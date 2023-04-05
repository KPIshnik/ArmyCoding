const db = require("./../DB/db");

const createEmailConfirmRow = async (id, key, email, date) => {
  const res = await db.query(
    "INSERT INTO emailconfirm(key, email, date, id)  VALUES( $1,$2,$3,$4)",
    [key, email, date, id]
  );
  return `new email/key entry created`;
};

module.exports = createEmailConfirmRow;
