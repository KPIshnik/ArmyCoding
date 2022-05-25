const pgConfig = {
    host: "tai.db.elephantsql.com",
    port: "5432",
    user: "erazuxgz",
    password: "3JaSHchksDu891lZc9J0QhUJJWKT04gK",
    database: "erazuxgz",
  };


const googleKeys = {
  googID :
  '892449788224-sujjjmuth9r16hf9e069o1vc9ap9ual6.apps.googleusercontent.com',
  googSecret : 
  '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'
}

const facebookKeys = {
  FACEBOOK_APP_ID : "1390653084786139",
  FACEBOOK_APP_SECRET : "11120c4fb0a7a2f7088706071a2a62e8"
}

const sendGridKeys = {
  API_KEY :  "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"
}

const session_config = {
    secret: process.env.SESSION_KEY || "secret",
    saveUninitialized: false,
    resave: true,
  };

  
const url='https://3000-kpishnik-atmycoding-fd4hu0rua1y.ws-eu46.gitpod.io'

exports.googleKeys = googleKeys;
exports.facebookKeys = facebookKeys;
exports.sendGridKeys = sendGridKeys;
exports.session_config = session_config;
exports.url = url;
exports.pgConfig = pgConfig;