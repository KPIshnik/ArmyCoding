const registerNewUser = require("../models/registerNewUser");
const bcript = require("bcrypt");
const confirmEmailHelper = require("../helpers/confirmEmailHelper");
const checkUniqueUsername = require("../models/checkUniqueUsername");
const checkIsRegistered = require("../models/checkIsRegistered");

const registerUser = async (req, res) => {
  const newUser = req.body;
  const { userName, password, email } = newUser;

  if (!newUser.valid) {
    throw new Error("not valid user data");
  }

  try {
    const isRegistered = await checkIsRegistered(email);

    if (isRegistered) {
      res.status(400).json("this email already registered, try another one");
      return;
    }

    const isUsernameUnique = await checkUniqueUsername(userName);

    if (!isUsernameUnique) {
      res.status(400).json("this username already registered, try another one");
      return;
    }

    const hashedPass = await bcript.hash(password, 10);
    const userid = await registerNewUser(
      null,
      userName,
      hashedPass,
      null,
      null,
      "email"
    );

    await confirmEmailHelper(userid, email);

    res.status(200).json(`user ${userName} registered, please confirm email`);
  } catch (err) {
    console.log(err);
    res.status(500).json("Oops, server error((");
  }
};

module.exports = registerUser;
