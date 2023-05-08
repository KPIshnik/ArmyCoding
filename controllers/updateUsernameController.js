const bcript = require("bcrypt");
const verifyPassword = require("../helpers/verifyPassword");
const setUserName = require("../models/setUserName");
const checkUniqueUsername = require("../models/checkUniqueUsername");
const renameAvatar = require("../helpers/renameAvatar");
const { updateAuthTokens } = require("../services/auth");
const getUserById = require("../models/getUserrById");

const updateUsernameController = async (req, res, next) => {
  try {
    const userPass = req.body.password;
    const username = req.body.username;
    const userid = req.user.id;
    const user = await getUserById(userid);

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

    const tokens = await updateAuthTokens(user.id, user.deviceid);

    res.status(200).json(tokens);
  } catch (err) {
    next(err);
  }
};

module.exports = updateUsernameController;
