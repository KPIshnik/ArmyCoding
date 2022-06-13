const pool = require("./DBconnection");

const registerNewUser = async (
  email,
  username,
  hashedPass,
  googId,
  facebookid,
  confirmed,
  auth_type
) => {
  const client = await pool.connect();
  try {
    const res = await client.query(
      "INSERT INTO users( email, username, password, googleid, facebookid, confirmed, auth_type)  VALUES( $1,$2,$3,$4,$5,$6,$7)",
      [email, username, hashedPass, googId, facebookid, confirmed, auth_type]
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
