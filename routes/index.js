const express = require("express");
const aloha = require("./aloha");
const login = require("./auth");
const register = require("./auth/register");
const googleAuthCb = require("./auth/googleAuthCb");
const fbAuthCb = require("./auth/fbAuthCb");
const googleAuth = require("./auth/google");
const facebookAuth = require("./auth/fb");
const confirmEmail = require("./auth/confirmEmail");
const avatar = require("./profile/avatar");
const username = require("./profile/username");
const userEmail = require("./profile/userEmail");
const password = require("./profile/password");

const router = express.Router();

router.use(
  aloha,
  avatar,
  login,
  register,
  googleAuthCb,
  fbAuthCb,
  facebookAuth,
  googleAuth,
  fbAuthCb,
  confirmEmail,
  username,
  userEmail,
  password
);

module.exports = router;
