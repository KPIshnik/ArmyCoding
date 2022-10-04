const bcript = require("bcrypt");
const getUserByUserName = require("../models/getUserByUsename");
const setUserEmail = require("../models/setUserEmail");
const getUserDataByKey = require("../models/getUserDataByKey");
const { confirmEmailExpireTime } = require("../configs/settings");

const confirmEmailController = async (req, res) => {
  const key = req.query.key;
  // const generatedTime = parseInt(key.split(".")[0]);

  // if (Date.now() - generatedTime > confirmEmailExpireTime) {
  //   res.send("time for email confirming has being expired ");
  //   return;
  // }

  const userData = await getUserDataByKey(key);
  if (!userData || Date.now() - userData.date > confirmEmailExpireTime)
    res.send("time for email confirming has being expired ");

  const user = await getUserByUserName(userData.username);

  const result = await setUserEmail(user.id, userData.email);

  if (result) res.send("Email confirmed");
  else res.status(400).send("something went wrong((");
  //res.sendStaus(200).send('vse zbs).redirect(???)
};

module.exports = confirmEmailController;
