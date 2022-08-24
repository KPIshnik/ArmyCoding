const bcript = require("bcrypt");
const verifyPassword = require("../models/verifyPassword");
const setUserName = require("../models/setUserName");
const checkUniqueUsername = require("../models/checkUniqueUsername");

const setUsernameController = async (req, res) => {
  const userPass = req.body.password;
  const username = req.body.username;
  const user = req.user;

  if (!username) {
    res.status(400).end("username required");
    return;
  }

  if (!userPass & (req.user.auth_type === "email")) {
    res.status(400).end("password required");
    return;
  }

  try {
    if (await checkUniqueUsername(username)) {
      res.status(400).end("username should be unique");
      return;
    }

    const passMach = await verifyPassword(user, userPass);

    if (userPass && !(await verifyPassword(user, userPass))) {
      res.status(400).end("wrong pass");
      return;
    }

    const result = await setUserName(user.id, username);

    res.end(`${result}`); // redirect to something norml later
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

module.exports = setUsernameController;
