const pool = require("./DBconnection");

const createEmailConfirmRow = async (username, key, email) => {
  const client = await pool.connect();
  try {
    const res = await client.query(
      "INSERT INTO emailconfirm(username, key, email)  VALUES( $1,$2,$3)",
      [username, key, email]
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
