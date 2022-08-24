const bcript = require("bcrypt");
const getUserByUserName = require("../models/getUserByUsename");
const setUserEmail = require("../models/setUserEmail");
const getUserDataByKey = require("../models/getUserDataByKey");

const expireTime = 3 * 3600 * 1000;

const confirmEmailController = async (req, res) => {
  const key = req.query.key;
  const generatedTime = parseInt(key.split(".")[0]);

  if (Date.now() - generatedTime > expireTime) {
    res.send("time for email confrming has being expired ");
    return;
  }

  const userData = await getUserDataByKey(key);
  console.log(userData);
  const user = await getUserByUserName(userData.username);
  console.log(user.id);
  const result = await setUserEmail(user.id, userData.email);
  console.log(result);

  if (result) res.send("Email confirmed");
  else res.status(400).send("something went wrong((");
  //res.sendStaus(200).send('vse zbs).redirect(???)
};

module.exports = confirmEmailController;
