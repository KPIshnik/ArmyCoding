const sendEmailThred = require("./sendMailThred");

const { url } = require("../configs/credentials.js");
const generateKey = require("./generateKey");
const createEmailConfirmRow = require("../models/createEmailConfirmRow");

const confirmEmailHelper = async (userid, email) => {
  const key = generateKey();

  await createEmailConfirmRow(userid, key, email, Date.now());

  const subject = "Confirm email";
  const content = `${url}/auth/confirmEmail?key=${key}`;

  sendEmailThred(email, subject, content);
};

module.exports = confirmEmailHelper;
