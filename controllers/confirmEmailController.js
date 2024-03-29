const setUserEmail = require("../models/setUserEmail");
const getUserDataByKey = require("../models/getUserDataByKey");
const { confirmEmailExpireTime } = require("../configs/config");
const deleteAllTokens = require("../models/auth/deleteAllTokens");

const confirmEmailController = async (req, res, next) => {
  try {
    const key = req.query && req.query.key;

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
    await deleteAllTokens(userData.id);

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

module.exports = confirmEmailController;
