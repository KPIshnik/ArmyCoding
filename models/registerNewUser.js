const db = require("../DB/db");

const registerNewUser = async (
  email,
  username,
  hashedPass,
  googId,
  facebookid,
  auth_type
) => {
  const res = await db.query(
    "INSERT INTO users( email, username, password, googleid, facebookid, auth_type)  VALUES( $1,$2,$3,$4,$5,$6) returning id",
    [email, username, hashedPass, googId, facebookid, auth_type]
  );

  const id = res.rows[0].id;
  return id;
};

module.exports = registerNewUser;
