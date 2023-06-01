const issueTokenPair = require("../../helpers/issueTokenPair");
const { url } = require("../../configs/config");
const superagent = require("superagent");
const jwt = require("jsonwebtoken");
const registerNewUser = require("../../models/registerNewUser");
const { facebookKeys } = require("../../configs/credentials");
const getUserByFacebookId = require("../../models/getUserByFacebookId");
const getNonce = require("../../models/getNonce");
const setNonce = require("../../models/setNonce");
const { createid } = require("../../helpers/createid");
const setUserFacebookId = require("../../models/setUserFBid");
const setUserEmail = require("../../models/setUserEmail");
const getUserByEmail = require("../../models/getUserByEmail");

class FacebookAuth {
  async getCode(req, res, next) {
    try {
      const nonce = createid();
      await setNonce(nonce);
      res.redirect(
        `https://www.facebook.com/v11.0/dialog/oauth?` +
          `client_id=${facebookKeys.FACEBOOK_APP_ID}&` +
          `response_type=code&` +
          `scope=openid&` +
          `redirect_uri=${url}/auth/fb/cb&` +
          `nonce=${nonce}`
      );
    } catch (err) {
      next(err);
    }
  }

  async getProfile(req, res, next) {
    try {
      if (req.query.error_message)
        return next(new Error(req.query.error_message));

      if (!req.query.code) return res.sendStatus(401);

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

      const nonce = await getNonce(profile.nonce);
      if (!nonce) return res.status(400).json("nonce do not match");

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
        const registeredUser = await getUserByEmail(profile.email);

        if (!registeredUser) {
          await registerNewUser(
            profile.email,
            null,
            null,
            null,
            profile.facebookid,
            "fb"
          );
        } else {
          await setUserFacebookId(registeredUser.id, profile.facebookid);
        }

        user = await getUserByFacebookId(profile.facebookid);

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

module.exports = new FacebookAuth();
