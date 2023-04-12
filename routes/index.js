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
const fail = require("./auth/fail");
const todolists = require("./todolists");
const todonote = require("./todolists/todonote");
const share = require("./todolists/share");
const permitted = require("./todolists/permitted");
const users = require("./profile/users");
const profile = require("./profile/index");

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
  profile,
  users,
  username,
  userEmail,
  password,
  fail,
  todonote,
  permitted,
  share,
  todolists
);

module.exports = router;
