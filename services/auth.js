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
const { url } = require("../configs/config");
const { googleKeys } = require("../configs/credentials");
const superagent = require("superagent");
const jwt = require("jsonwebtoken");
const getUserByGoogleId = require("../models/getUserByGoogleId");
const registerNewUser = require("../models/registerNewUser");
const checkIsRegistered = require("../helpers/checkIsRegistered");

class Auth {
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

  async getCode(req, res, next) {
    try {
      res.redirect(
        `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${googleKeys.googID}&` +
          `response_type=code&` +
          `scope=openid%20email%20profile&` +
          `redirect_uri=${url}/auth/google/cb&`
      );
    } catch (err) {
      next(err);
    }
  }

  async getProfile(req, res, next) {
    try {
      const requestBody =
        `code=${req.query.code}` +
        `&client_id=${googleKeys.googID}` +
        `&client_secret=${googleKeys.googSecret}` +
        `&redirect_uri=${url}/auth/google/cb` +
        "&grant_type=authorization_code";

      const googleReponse = await superagent
        .post("https://oauth2.googleapis.com/token")
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send(requestBody);

      const idToken = googleReponse.body && googleReponse.body.id_token;
      const profile = idToken && jwt.decode(idToken);

      if (!profile) return res.sendStatus(401);

      req.profile = {
        googleid: profile.sub,
        email: profile.email,
      };
      next();
    } catch (err) {
      next(err);
    }
  }
  async authenticate(req, res, next) {
    try {
      const profile = req.profile;
      if (!profile) return res.sendStatus(401);

      let user = await getUserByGoogleId(profile.googleid);

      if (!user) {
        if (await checkIsRegistered(profile.email))
          return res.status(400).json("this email already registered");

        await registerNewUser(
          profile.email,
          //profile.displayName,
          null,
          null,
          profile.googleid,
          null,
          "google"
        );
        user = await getUserByGoogleId(profile.googleid);

        const tokens = await issueTokenPair(user);
        return res.status(200).json(tokens);
      }

      delete user.password;

      const tokens = await issueTokenPair(user);
      res.status(200).json(tokens);
    } catch (error) {
      next(error);
    }
  }
}

const auth = new Auth();

exports.auth = auth;
