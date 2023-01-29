const verifyPassword = require("../models/verifyPassword");
const setUserPassword = require("../models/setUserPassword");
const bcrypt = require("bcrypt");

const setUserPasswordController = async (req, res) => {
  const user = req.user;
  const password = req.body.password;
  const newPass = req.body.newPass;

  if (!req.body.valid) {
    res.status(400).json("request not valid");
  }

  try {
    if (!(await verifyPassword(user, password))) {
      res.status(400).json("wrong pass");
      return;
    }

    const hashedPass = await bcrypt.hash(newPass, 10);

    await setUserPassword(user.id, hashedPass);

    res.status(200).json("password chenged"); // redirect to something norml later
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

module.exports = setUserPasswordController;
