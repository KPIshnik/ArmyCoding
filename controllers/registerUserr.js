const checkIsRegistered = require("../models/checkIsRegistered");
const registerNewUser = require("../models/registerNewUser");
const bcript = require("bcrypt");
const sendEmailThred = require("../helpers/sendMailThred");
const getUserByEmail = require("../models/getUserByEmail");
const url=require('../configs/url')


const registerUser = async (req, res) => {
  const newUser = req.body;
  console.log(newUser)

  try {
    if (!newUser.password || newUser.password != newUser.password2) {
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

    // продолжить позже
    //content = token (id)соответственно надо взять id
    const user = await getUserByEmail(email);
    console.log(user.id);
    const hashedId = await bcript.hash(`${user.id}`, 10);
    const content = `${url}/confirmEmail?id=${hashedId}`;

    sendEmailThred(email, subject, content);

    res.end(result);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

module.exports = registerUser;
