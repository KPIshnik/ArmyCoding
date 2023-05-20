const issueTokenPair = require("../../helpers/issueTokenPair");
const { url } = require("../../configs/config");
const { googleKeys } = require("../../configs/credentials");
const superagent = require("superagent");
const jwt = require("jsonwebtoken");
const getUserByGoogleId = require("../../models/getUserByGoogleId");
const registerNewUser = require("../../models/registerNewUser");
const checkIsRegistered = require("../../helpers/checkIsRegistered");
const getNonce = require("../../models/getNonce");
const { createid } = require("../../helpers/createid");
const setNonce = require("../../models/setNonce");

class GoogleAuth {
  async getCode(req, res, next) {
    try {
      const nonce = createid();
      await setNonce(nonce);
      res.redirect(
        `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${googleKeys.googID}&` +
          `response_type=code&` +
          `scope=openid%20email%20profile&` +
          `redirect_uri=${url}/auth/google/cb&` +
          `nonce=${nonce}`
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
      console.log(profile);

      const nonce = await getNonce(profile.nonce);
      if (!nonce) return res.status(400).json("nonce do not match");

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

module.exports = new GoogleAuth();
