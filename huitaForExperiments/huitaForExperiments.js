const generateKey = require("../helpers/generateKey");
const sendEmail = require("../helpers/sendEmail");
const poeben = require("./poeben");
const superagent = require("superagent");
const { mailsacKey } = require("../configs/credentials");
const fs = require("fs");

const file = fs.readFileSync(__dirname + "/poeben.js");
console.log(file);
