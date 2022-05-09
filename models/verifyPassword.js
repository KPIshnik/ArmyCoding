const bcrypt = require("bcrypt");

const verifyPassword = async (user, password) => {
  try {
    return await bcrypt.compare(password, user.password);
  } catch (err) {
    throw err;
  }
};

module.exports = verifyPassword;
