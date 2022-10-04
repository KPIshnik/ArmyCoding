const pool = require("./DBconnection");

const createEmailConfirmRow = async (username, key, email, date) => {
  const client = await pool.connect();
  try {
    const res = await client.query(
      "INSERT INTO emailconfirm(username, key, email, date)  VALUES( $1,$2,$3,$4)",
      [username, key, email, date]
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
