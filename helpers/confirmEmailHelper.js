const sendEmailThred = require("./sendMailThred");

const { url } = require("../configs/config");
const generateKey = require("./generateKey");
const createEmailConfirmRow = require("../models/createEmailConfirmRow");

const confirmEmailHelper = async (userid, email) => {
  const key = generateKey();

  await createEmailConfirmRow(userid, key, email, Date.now());

  const subject = "Confirm email";
  const content = `${url}/auth/confirmEmail?key=${key}`;

  const res = await sendEmailThred(email, subject, content);
  console.log(res);
  return;
};

module.exports = confirmEmailHelper;
