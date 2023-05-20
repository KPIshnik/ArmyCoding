const issueTokenPair = require("../../helpers/issueTokenPair");
const { url } = require("../../configs/config");

const superagent = require("superagent");
const jwt = require("jsonwebtoken");
const getUserByGoogleId = require("../../models/getUserByGoogleId");
const registerNewUser = require("../../models/registerNewUser");
const checkIsRegistered = require("../../helpers/checkIsRegistered");
const { facebookKeys } = require("../../configs/credentials");
const getUserByFacebookId = require("../../models/getUserByFacebookId");

class FacebookAuth {
  async getCode(req, res, next) {
    try {
      res.redirect(
        `https://www.facebook.com/v11.0/dialog/oauth?` +
          `client_id=${facebookKeys.FACEBOOK_APP_ID}&` +
          `response_type=code&` +
          `scope=openid&` +
          `redirect_uri=${url}/auth/fb/cb&`
      );
    } catch (err) {
      next(err);
    }
  }

  async getProfile(req, res, next) {
    try {
      const requestBody =
        `code=${req.query.code}` +
        `&client_id=${facebookKeys.FACEBOOK_APP_ID}` +
        `&client_secret=${facebookKeys.FACEBOOK_APP_SECRET}` +
        `&redirect_uri=${url}/auth/fb/cb` +
        "&grant_type=authorization_code";

      const fbReponse = await superagent.get(
        `https://graph.facebook.com/v11.0/oauth/access_token?${requestBody}`
      );

      const idToken = fbReponse.body && fbReponse.body.id_token;
      const profile = idToken && jwt.decode(idToken);

      if (!profile) return res.sendStatus(401);

      req.profile = {
        facebookid: profile.sub,
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

      let user = await getUserByFacebookId(profile.facebookid);

      if (!user) {
        if (await checkIsRegistered(profile.email))
          return res.status(400).json("this email already registered");

        await registerNewUser(
          profile.email,
          null,
          null,
          null,
          profile.facebookid,
          "fb"
        );
        user = await getUserByFacebookId(profile.facebookid);

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

module.exports = new FacebookAuth();
