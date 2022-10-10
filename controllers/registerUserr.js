const checkIsRegistered = require("../models/checkIsRegistered");
const registerNewUser = require("../models/registerNewUser");
const bcript = require("bcrypt");
const confirmEmailHelper = require("../helpers/confirmEmailHelper");
const checkUniqueUsername = require("../models/checkUniqueUsername");

const registerUser = async (req, res) => {
  const newUser = req.body;
  const { userName, password, email } = newUser;

  try {
    if (!userName) {
      res.status(400).json("username missing");
      return;
    }

    if (!email) {
      res.status(400).json("email missing");
      return;
    }

    if (!password || password != newUser.password2) {
      res.status(400).json("pass too short or does not match");
      return;
    }

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
    //forein  key + createEmCinfRow
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
    res.sendStatus(500);
  }
};

module.exports = registerUser;
