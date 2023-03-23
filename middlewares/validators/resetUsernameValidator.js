const emailValidator = require("deep-email-validator");

const resetUsernameValidator = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

module.exports = resetUsernameValidator;
