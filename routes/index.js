const express = require("express");
const aloha = require("./aloha");
const login = require("./login");
const register = require("./register");
const huita = require("./huita");
const huitaForFB = require("./huitaForFB");
const googleAuth = require("./googleAuth");
const facebookAuth = require("./facebookAuth");
const confirmEmail = require("./confirmEmail");
const { request } = require("express");
const router = express.Router();

router.use(
  aloha,
  login,
  register,
  huita,
  googleAuth,
  facebookAuth,
  huitaForFB,
  confirmEmail
);

module.exports = router;
