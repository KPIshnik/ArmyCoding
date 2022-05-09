//Разнести на разные фалы может??
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const getUserByEmail = require("../models/getUserByEmail");
const verifyPassword = require("../models/verifyPassword");
const getUserById = require("../models/getUserrById");
const checkIsRegistered = require("../models/checkIsRegistered");
const registerNewUser = require("../models/registerNewUser");

const googID =
  "771188073637-9sabumd93ihn86b448689dcq0a35he2p.apps.googleusercontent.com";
const googSecret = "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";

const FACEBOOK_APP_ID = "435318228339071";
const FACEBOOK_APP_SECRET = "812e1d6790276fe6f48da8fe96f41c0f";

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, pass, done) => {
      try {
        const user = await getUserByEmail(email);

        if (!pass) return done(null, false);
        if (!user) return done(null, false);
        if (!(await verifyPassword(user, pass))) return done(null, false);

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: googID,
      clientSecret: googSecret,
      callbackURL: "http://localhost:3000/huita",
    },

    async (accessToken, refreshToken, profile, done) => {
      const user = await getUserByEmail(profile.emails[0].value);
      console.log(profile.emails[0].value);
      if (!user) {
        console.log(profile.emails[0].value);
        await registerNewUser(
          profile.emails[0].value,
          profile.displayName,
          null,
          profile.id,
          null
        );
        const user = await getUserByEmail(profile.emails[0].value);
        return done(null, user);
      }

      // console.log(profile);
      return done(null, user);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/huitaForFB",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await getUserByEmail(profile._json.email);
      if (!user) {
        await registerNewUser(
          profile._json.email,
          profile._json.name,
          null,
          null,
          profile._json.id
        );
        user = await getUserByEmail(profile._json.email);
        return done(null, user);
      }
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    return done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
