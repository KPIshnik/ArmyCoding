const pool = require("./DBconnection");

const registerNewUser = async (
  email,
  username,
  hashedPass,
  googId,
  facebookid
) => {
  const client = await pool.connect();
  try {
    const res = await client.query(
      "INSERT INTO users( email, username, password, googleid, facebookid)  VALUES( $1,$2,$3,$4,$5)",
      [email, username, hashedPass, googId, facebookid]
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
