const bcript = require("bcrypt");
const verifyPassword = require("../helpers/verifyPassword");
const setUserName = require("../models/setUserName");
const checkUniqueUsername = require("../models/checkUniqueUsername");
const renameAvatar = require("../helpers/renameAvatar");

const updateUsernameController = async (req, res, next) => {
  try {
    const userPass = req.body.password;
    const username = req.body.username;
    const user = req.user;

    if (!req.body.valid) {
      res.status(400).json("request not valid");
    }

    if (!(await checkUniqueUsername(username))) {
      res.status(400).json("username should be unique");
      return;
    }

    if (userPass && !(await verifyPassword(user, userPass))) {
      res.status(401).json("wrong pass");
      return;
    }

    await renameAvatar(req.user.username, username);
    await setUserName(user.id, username);

    res.status(200).json("username changed");
  } catch (err) {
    next(err);
  }
};

module.exports = updateUsernameController;
