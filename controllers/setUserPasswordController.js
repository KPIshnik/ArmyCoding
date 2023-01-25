const verifyPassword = require("../models/verifyPassword");
const setUserPassword = require("../models/setUserPassword");
const bcrypt = require("bcrypt");

const setUserPasswordController = async (req, res) => {
  const user = req.user;
  const password = req.body.password;
  const newPass = req.body.newPass;
  const newPass2 = req.body.newPass2;

  if (!password) {
    res.status(400).json("password required");
    return;
  }

  if (!newPass || !(newPass === newPass2)) {
    res.status(400).json("pass to short or doesn't match");
    return;
  }

  try {
    if (!(await verifyPassword(user, password))) {
      res.status(400).json("wrong pass");
      return;
    }

    const hashedPass = await bcrypt.hash(newPass, 10);

    const result = await setUserPassword(user.id, hashedPass);

    res.status(200).json("password chenged"); // redirect to something norml later
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

module.exports = setUserPasswordController;
