const registerNewUser = require("../models/registerNewUser");
const bcript = require("bcrypt");
const confirmEmailHelper = require("../helpers/confirmEmailHelper");
const checkUniqueUsername = require("../models/checkUniqueUsername");
const checkIsRegistered = require("../helpers/checkIsRegistered");

const registerUser = async (req, res, next) => {
  const newUser = req.body;
  const { username, password, email } = newUser;

  try {
    if (!newUser.valid) {
      throw new Error("not valid user data");
    }
    const isRegistered = await checkIsRegistered(email);

    if (isRegistered) {
      res.status(400).json("this email already registered, try another one");
      return;
    }

    const isUsernameUnique = await checkUniqueUsername(username);

    if (!isUsernameUnique) {
      res.status(400).json("this username already registered, try another one");
      return;
    }

    const hashedPass = await bcript.hash(password, 10);
    const userid = await registerNewUser(
      null,
      username,
      hashedPass,
      null,
      null,
      "email"
    );

    await confirmEmailHelper(userid, email);

    res.status(200).json(`user ${username} registered, please confirm email`);
  } catch (err) {
    next(err);
  }
};

module.exports = registerUser;
