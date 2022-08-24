const sendEmailThred = require("../helpers/sendMailThred");

const { url } = require("../configs/credentials.js");
const generateKey = require("../helpers/generateKey");
const createEmailConfirmRow = require("../models/createEmailConfirmRow");

const sendConfirmEmailHelper = async (userName, email) => {
	const key = generateKey();
	await createEmailConfirmRow(userName, key, email);
	const subject = "Confirm email";
	const content = `${url}/auth/confirmEmail?key=${key}`;

	sendEmailThred(email, subject, content);
};

module.exports = sendConfirmEmailHelper;
