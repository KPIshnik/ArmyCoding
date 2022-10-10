const pool = require("./DBconnection");

const registerNewUser = async (
  email,
  username,
  hashedPass,
  googId,
  facebookid,
  auth_type
) => {
  const client = await pool.connect();
  const res = await client.query(
    "INSERT INTO users( email, username, password, googleid, facebookid, auth_type)  VALUES( $1,$2,$3,$4,$5,$6) returning id",
    [email, username, hashedPass, googId, facebookid, auth_type]
  );

  client.release();
  const id = res.rows[0].id;
  return id;
};

module.exports = registerNewUser;
