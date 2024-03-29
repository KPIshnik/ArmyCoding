const bcript = require("bcrypt");
const verifyPassword = require("../helpers/verifyPassword");
const checkUniqueUserEmail = require("../models/checkUniqueUserEmail");
const confirmEmailHelper = require("../helpers/confirmEmailHelper");
const getUserById = require("../models/getUserrById");

const updateUserEmailController = async (req, res, next) => {
  try {
    const userPass = req.body.password;
    const userEmail = req.body.email;
    const userid = req.user.id;

    const user = await getUserById(userid);

    if (await checkUniqueUserEmail(userEmail)) {
      res.status(400).json("email should be unique");
      return;
    }

    if (!(await verifyPassword(user, userPass))) {
      res.status(401).json("wrong pass");
      return;
    }

    await confirmEmailHelper(user.id, userEmail);

    res.status(200).json("confirm new email");
  } catch (err) {
    next(err);
  }
};

module.exports = updateUserEmailController;
