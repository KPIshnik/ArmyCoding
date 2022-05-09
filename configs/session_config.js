const session_config = {
  secret: process.env.SESSION_KEY || "secret",
  saveUninitialized: false,
  resave: true,
};
module.exports = session_config;
