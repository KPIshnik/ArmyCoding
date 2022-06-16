const bcript = require("bcrypt");
const getUserByUsername = require("../models/getUserByUsename");
const setEmailConfirm = require("../models/setEmailConfirm");

const confirmEmailController = async (req, res) => {
  const username = req.query.username;
  const hashedId = req.query.id;
  const user = await getUserByUsername(username);
  const checkID = await bcript.compare(`${user.id}`, hashedId);

  if (checkID) {
    const result = await setEmailConfirm(user.id);

    if (result) res.end("Email confirmed");
    else res.end("Oops");
    //res.sendStaus(200).send('vse zbs).redirect(???)
  } else res.end("email not confirmed");
};

module.exports = confirmEmailController;
