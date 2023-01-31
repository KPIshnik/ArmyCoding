const emailValidator = require("deep-email-validator");

const resetUserEmailValidator = async (req, res, next) => {
  const { password, newPass, newPass2 } = req.body;
  req.body.valid = false;

  const userPass = req.body.password;
  const userEmail = req.body.email;

  if (!userPass) {
    res.status(400).json("password required");
    return;
  }

  if (!userEmail) {
    res.status(400).json("email required");
    return;
  }

  req.body.valid = true;
  next();
};

module.exports = resetUserEmailValidator;
