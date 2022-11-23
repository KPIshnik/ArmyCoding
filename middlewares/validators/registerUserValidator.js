const emailValidator = require("deep-email-validator");

const registerUserValidator = async (req, res, next) => {
  const { userName, email, password, password2 } = req.body;
  req.body.valid = false;

  if (!userName) {
    res.status(400).json("username missing");
    return;
  }

  if (!email) {
    res.status(400).json("email missing");
    return;
  }

  const isEmailValod = await emailValidator.validate(email);

  if (!isEmailValod.valid) {
    res.status(400).json("email not valid");
    return;
  }

  if (!password || password != password2) {
    res.status(400).json("pass too short or does not match");
    return;
  }

  req.body.valid = true;
  next();
};

module.exports = registerUserValidator;
