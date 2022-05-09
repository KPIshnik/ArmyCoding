const checkIsRegistered = require("../models/checkIsRegistered");
const registerNewUser = require("../models/registerNewUser");
const bcript = require("bcrypt");
const sendEmailThred = require("../helpers/sendMailThred");
const getUserByEmail = require("../models/getUserByEmail");

const registerUser = async (req, res) => {
  const newUser = req.body;
  try {
    if (!newUser.password || newUser.password != newUser.password2) {
      res.status(400).send("pass too short or does not match");
      res.status(400).send("pass too short or does not match");
      return;
    }

    const isRegistered = await checkIsRegistered(req.body.email);

    if (isRegistered) {
      res.status(400).send("this email already registered, try anotherone");
      return;
    }

    const { userName, password, email } = newUser;

    const hashedPass = await bcript.hash(password, 10);
    const result = await registerNewUser(
      email,
      userName,
      hashedPass,
      null,
      null,
      false
    );

    const subject = "Confirm email";

    //content = token (id)соответственно надо взять id
    const userId = await getUserByEmail(email).id;
    console.log(userId);
    const hashedId = await bcript.hash(userId, 10);
    const content = `localhost:3000/confirmEmail?id=${hashedId}`;

    sendEmailThred(email, subject, content);

    res.end(result);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

module.exports = registerUser;
