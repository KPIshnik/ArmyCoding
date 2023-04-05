const bcrypt = require("bcrypt");

const verifyPassword = async (user, password) => {
  return await bcrypt.compare(password, user.password);
};

module.exports = verifyPassword;
