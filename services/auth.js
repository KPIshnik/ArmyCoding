const { tokensecret } = require("../configs/credentials");
const verifyPassword = require("../helpers/verifyPassword");
const getUserByEmail = require("../models/getUserByEmail");
const verifyToken = require("../helpers/verifyToken");
const deleteRefreshToken = require("../models/auth/deleteDeviceId");
const issueTokenPair = require("../helpers/issueTokenPair");
const deleteAllTokens = require("../models/auth/deleteAllTokens");
const getUserById = require("../models/getUserrById");
const getRefreshToken = require("../models/auth/getRefreshToken");
const deleteDeviceId = require("../models/auth/deleteDeviceId");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await getUserByEmail(email);

    if (!password) return res.status(400).json("password rquired");
    if (!user) return res.sendStatus(404);

    const isPasswordValid = await verifyPassword(user, password);

    if (!isPasswordValid) return res.status(400).json("bad password");

    delete user.password;

    const tokens = await issueTokenPair(user);

    res.status(200).json(tokens);
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { token, refreshtoken } = req.body;

    const user = await verifyToken(token, tokensecret, {
      ignoreExpiration: true,
    });

    if (!user) return res.sendStatus(401);

    const oldToken = await getRefreshToken(user.deviceid);

    if (!oldToken) return res.sendStatus(404);
    if (oldToken !== refreshtoken) {
      await deleteDeviceId(user.deviceid);
      return res.status(400).json("refresh token not valid, relogin");
    }

    delete user.iat;
    delete user.exp;

    const tokens = await issueTokenPair(user);

    res.status(200).json(tokens);
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    await deleteRefreshToken(req.user.deviceid);

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

const totalLogout = async (req, res, next) => {
  try {
    const user = req.user;

    await deleteAllTokens(user.id);

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

exports.updateAuthTokens = async (userid, deviceid) => {
  const user = getUserById(userid);

  delete user.password;
  user.deviceid = deviceid;

  const tokens = issueTokenPair(user);
  return tokens;
};

exports.login = login;
exports.totalLogout = totalLogout;
exports.logout = logout;
exports.refresh = refresh;
