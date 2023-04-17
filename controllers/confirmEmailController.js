const setUserEmail = require("../models/setUserEmail");
const getUserDataByKey = require("../models/getUserDataByKey");
const { confirmEmailExpireTime } = require("../configs/settings");

const confirmEmailController = async (req, res, next) => {
  try {
    const key = req.query ? req.query.key : null;

    if (!key || typeof key != "string") {
      res.status(400).json("valid key required");
      return;
    }

    const userData = await getUserDataByKey(key);

    if (!userData) {
      res.status(400).json("confirm key not valid or expired");
      return;
    }

    if (Date.now() - userData.date >= confirmEmailExpireTime) {
      res.status(400).json("confirm key expired");
      return;
    }

    if (!userData.email || !userData.id) {
      res.status(400).json("bad data, reregister");
      return;
    }

    await setUserEmail(userData.id, userData.email);

    res.status(200).json("Email confirmed");
  } catch (err) {
    next(err);
  }
};

module.exports = confirmEmailController;
