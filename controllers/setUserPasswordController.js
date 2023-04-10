const verifyPassword = require("../helpers/verifyPassword");
const setUserPassword = require("../models/setUserPassword");
const bcrypt = require("bcrypt");

const setUserPasswordController = async (req, res, next) => {
  try {
    const user = req.user;
    const password = req.body.password;
    const newPass = req.body.newPass;

    if (!req.body.valid) {
      return res.status(400).json("request not valid");
    }

    if (!(await verifyPassword(user, password))) {
      return res.status(400).json("wrong pass");
    }

    const hashedPass = await bcrypt.hash(newPass, 10);

    await setUserPassword(user.id, hashedPass);

    res.status(200).json("password chenged");
  } catch (err) {
    next(err);
  }
};

module.exports = setUserPasswordController;
