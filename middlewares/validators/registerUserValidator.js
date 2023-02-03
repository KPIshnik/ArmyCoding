const emailValidator = require("deep-email-validator");

const registerUserValidator = async (req, res, next) => {
  req.body.valid = false;
  const newUser = req.body;

  const { userName, password, email } = newUser;

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

  const isEmailValid = await emailValidator.validate(email);

  if (!isEmailValid.valid) {
    console.log(isEmailValid);
    res.status(400).json("email not valid");
    return;
  }

  req.body.valid = true;
  next();
};

module.exports = registerUserValidator;
