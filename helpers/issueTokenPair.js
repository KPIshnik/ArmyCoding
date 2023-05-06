const { tokensecret } = require("../configs/credentials");

const addToken = require("../models/auth/addToken");
const jwt = require("jsonwebtoken");
const { createid } = require("./createid");
const updateRefreshToken = require("../models/auth/updateRefreshToken");

const issueTokenPair = async (user) => {
  const refreshtoken = createid();
  if (!user.deviceid) {
    user.deviceid = createid();
    await addToken(user.id, refreshtoken, user.deviceid);
  } else {
    await updateRefreshToken(refreshtoken, user.deviceid);
  }
  return {
    token: jwt.sign(user, tokensecret, { expiresIn: "15m" }),
    refreshtoken,
  };
};

module.exports = issueTokenPair;
