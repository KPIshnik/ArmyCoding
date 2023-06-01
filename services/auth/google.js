const issueTokenPair = require("../../helpers/issueTokenPair");
const { url } = require("../../configs/config");
const { googleKeys } = require("../../configs/credentials");
const superagent = require("superagent");
const jwt = require("jsonwebtoken");
const getUserByGoogleId = require("../../models/getUserByGoogleId");
const registerNewUser = require("../../models/registerNewUser");
const getNonce = require("../../models/getNonce");
const { createid } = require("../../helpers/createid");
const setNonce = require("../../models/setNonce");
const getUserByEmail = require("../../models/getUserByEmail");
const setUserGoogleid = require("../../models/setUserGoogleId");
const setUserEmail = require("../../models/setUserEmail");

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
      if (!req.query.code) return res.sendStatus(401);

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
        const registeredUser = await getUserByEmail(profile.email);

        if (!registeredUser) {
          await registerNewUser(
            profile.email,
            null,
            null,
            profile.googleid,
            null,
            "google"
          );
        } else {
          await setUserGoogleid(registeredUser.id, profile.googleid);
        }

        user = await getUserByGoogleId(profile.googleid);

        const tokens = await issueTokenPair(user);
        return res.status(200).json(tokens);
      }

      if (user.email != profile.email) {
        await setUserEmail(user.id, profile.email);
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
