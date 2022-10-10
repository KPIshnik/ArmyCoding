const setUserEmail = require("../models/setUserEmail");
const getUserDataByKey = require("../models/getUserDataByKey");
const { confirmEmailExpireTime } = require("../configs/settings");

const confirmEmailController = async (req, res) => {
  const key = req.query.key;

  if (!key) {
    res.status(400).json("key required");
    return;
  }

  try {
    const userData = await getUserDataByKey(key);

    if (!userData || Date.now() - userData.date > confirmEmailExpireTime) {
      res.status(400).json("time for email confirming has being expired ");
      return;
    }

    await setUserEmail(userData.id, userData.email);

    res.status(200).json("Email confirmed");
  } catch (err) {
    res.status(400).json("something went wrong");
    throw err;
  }
};

module.exports = confirmEmailController;
