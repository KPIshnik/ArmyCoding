const bcript = require("bcrypt");
const verifyPassword = require("../models/verifyPassword");
const setUserName = require("../models/setUserName");
const checkUniqueUsername = require("../models/checkUniqueUsername");

const setUsernameController = async (req, res) => {
  const userPass = req.body.password;
  const username = req.body.username;
  const user = req.user;

  if (!username) {
    res.send("username required");
    return;
  }

  if (!userPass & (req.user.auth_type === "email")) {
    res.send("password required");
    return;
  }

  try {
    if (!(await checkUniqueUsername(username))) {
      res.status(400).json("username should be unique");
      return;
    }

    if (userPass && !(await verifyPassword(user, userPass))) {
      res.status(400).json("wrong pass");
      return;
    }

    await setUserName(user.id, username);

    res.redirect("/"); // redirect to something norml later
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

module.exports = setUsernameController;
