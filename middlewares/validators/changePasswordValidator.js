const emailValidator = require("deep-email-validator");

const resetPassValidator = async (req, res, next) => {
  const { password, newPass, newPass2 } = req.body;
  req.body.valid = false;

  if (!password) {
    res.status(400).json("password required");
    return;
  }

  if (!newPass || !(newPass === newPass2)) {
    res.status(400).json("pass to short or doesn't match");
    return;
  }

  req.body.valid = true;
  next();
};

module.exports = resetPassValidator;
