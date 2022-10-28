const bcript = require("bcrypt");
const verifyPassword = require("../models/verifyPassword");
const checkUniqueUserEmail = require("../models/checkUniqueUserEmail");
const confirmEmailHelper = require("../helpers/confirmEmailHelper");

const setUserEmailController = async (req, res) => {
  const userPass = req.body.password;
  const userEmail = req.body.email;
  const user = req.user;

  if (!userPass) {
    res.send("password required");
    return;
  }

  if (!userEmail) {
    res.send("email required");
    return;
  }

  try {
    if (await checkUniqueUserEmail(userEmail)) {
      res.send("email should be unique");
      return;
    }

    if (!(await verifyPassword(user, userPass))) {
      res.send("wrong pass");
      return;
    }

    await confirmEmailHelper(user.id, userEmail);

    res.status(200).json("confirm new email");
  } catch (err) {
    console.log(err);
    res.send("server error");
  }
};

module.exports = setUserEmailController;
