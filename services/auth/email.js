const { tokensecret } = require("../../configs/credentials");
const verifyPassword = require("../../helpers/verifyPassword");
const getUserByEmail = require("../../models/getUserByEmail");
const verifyToken = require("../../helpers/verifyToken");
const deleteRefreshToken = require("../../models/auth/deleteDeviceId");
const issueTokenPair = require("../../helpers/issueTokenPair");
const deleteAllTokens = require("../../models/auth/deleteAllTokens");
const getUserById = require("../../models/getUserrById");
const getRefreshToken = require("../../models/auth/getRefreshToken");
const deleteDeviceId = require("../../models/auth/deleteDeviceId");

class EmailAuth {
  constructor() {
    this.google = {
      getCode: this.getCode,
      getProfile: this.getProfile,
      authenticate: this.authenticate,
    };
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!password) return res.status(400).json("password required");

      let user = await getUserByEmail(email);

      if (!user) return res.sendStatus(404);

      const isPasswordValid = await verifyPassword(user, password);

      if (!isPasswordValid) return res.status(400).json("bad password");

      delete user.password;

      const tokens = await issueTokenPair(user);

      res.status(200).json(tokens);
    } catch (err) {
      next(err);
    }
  }

  async tokenRefresh(req, res, next) {
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
  }

  async logout(req, res, next) {
    try {
      await deleteRefreshToken(req.user.deviceid);

      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }

  async totalLogout(req, res, next) {
    try {
      const user = req.user;

      await deleteAllTokens(user.id);

      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }

  async updateAuthTokens(userid, deviceid) {
    const user = await getUserById(userid);

    delete user.password;
    user.deviceid = deviceid;

    const tokens = await issueTokenPair(user);
    return tokens;
  }
}

module.exports = new EmailAuth();
