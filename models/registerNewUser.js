const pool = require("./DBconnection");

const registerNewUser = async (
  email,
  username,
  hashedPass,
  googId,
  facebookid,
  confirmed
) => {
  const client = await pool.connect();
  try {
    const res = await client.query(
      "INSERT INTO users( email, username, password, googleid, facebookid, confirmed)  VALUES( $1,$2,$3,$4,$5,$6)",
      [email, username, hashedPass, googId, facebookid, confirmed]
    );
    return `user ${username} registered`;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = registerNewUser;
