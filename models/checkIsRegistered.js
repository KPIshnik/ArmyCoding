const getUserByEmail = require("./getUserByEmail");

const checkIsRegistered = async (email) => {
  try {
    const user = await getUserByEmail(email);

    return user ? true : false;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = checkIsRegistered;
