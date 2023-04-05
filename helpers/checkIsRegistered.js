const getUserByEmail = require("../models/getUserByEmail");

const checkIsRegistered = async (email) => {
  const user = await getUserByEmail(email);

  return user ? true : false;
};

module.exports = checkIsRegistered;
