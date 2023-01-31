const emailValidator = require("deep-email-validator");

const resetUsernameValidator = async (req, res, next) => {
  const { password, newPass, newPass2 } = req.body;
  req.body.valid = false;

  const userPass = req.body.password;
  const username = req.body.username;

  if (!username) {
    res.status(400).json("username required");
    return;
  }

  if (!userPass & (req.user.auth_type === "email")) {
    res.status(400).json("password required");
    return;
  }

  req.body.valid = true;
  next();
};

module.exports = resetUsernameValidator;
