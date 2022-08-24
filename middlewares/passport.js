//Разнести на разные фалы может??

//Доделать. Шо с токенами???

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const getUserByEmail = require("../models/getUserByEmail");
const verifyPassword = require("../models/verifyPassword");
const getUserById = require("../models/getUserrById");
const getUserByGoogleID = require("../models/getUserByGoogleId");
const registerNewUser = require("../models/registerNewUser");
const { url } = require("../configs/credentials");
const { googleKeys } = require("../configs/credentials");
const { facebookKeys } = require("../configs/credentials");

const googID = googleKeys.googID;
const googSecret = googleKeys.googSecret;

const FACEBOOK_APP_ID = facebookKeys.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = facebookKeys.FACEBOOK_APP_SECRET;

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, pass, done) => {
      try {
        let user = await getUserByEmail(email);

        if (!pass) return done(null, false);
        if (!user) return done(null, false);
        // if (!user.confirmed) return done(null, false);//make messages
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
      callbackURL: `${url}/auth/google/cb`,
      // passReqToCallback: true
    },

    async (accessToken, refreshToken, profile, done) => {
      let user = await getUserByGoogleID(profile.id);

      // !! REFAKTOR PART !!
      // if (!user) {
      //   const res = await googleRegisterUserController(profile);
      // }

      // const googleRegisterUserController = (profile) => {
      //   isEmailunique(profile.email) ? caryOn : setGoogleID;
      //   is;
      // };

      if (!user) {
        await registerNewUser(
          profile.emails[0].value,
          //profile.displayName,
          null,
          null,
          profile.id,
          null,
          "google"
        );
        user = await getUserByGoogleID(profile.id);
        return done(null, user); //and message that its because new
      }

      return done(null, user);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: `${url}/auth/fb/cb`,
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await getUserByEmail(profile._json.email);
      if (!user) {
        await registerNewUser(
          profile._json.email,
          //profile._json.name,
          null,
          null,
          null,
          profile._json.id,
          "fb"
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
