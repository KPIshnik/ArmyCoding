const pool = require("./DBconnection");

const createEmailConfirmRow = async (id, key, email, date) => {
  const client = await pool.connect();
  try {
    const res = await client.query(
      "INSERT INTO emailconfirm(key, email, date, id)  VALUES( $1,$2,$3,$4)",
      [key, email, date, id]
    );
    return `new email/key entry created`;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = createEmailConfirmRow;
