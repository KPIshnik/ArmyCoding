const checkIsRegistered = require("../models/checkIsRegistered");
const registerNewUser = require("../models/registerNewUser");
const bcript = require("bcrypt");
const sendEmailThred = require("../helpers/sendMailThred");

const { url } = require("../configs/credentials.js");
const generateKey = require("../helpers/generateKey");
const createEmailConfirmRow = require("../models/createEmailConfirmRow");
const sendConfirmEmailHelper = require("../helpers/sendConfirmEmailHelper");

const registerUser = async (req, res) => {
	const newUser = req.body;
	console.log(newUser);
	// !! add isUnique and not null ckeks !!
	try {
		if (!newUser.password || newUser.password != newUser.password2) {
			res.status(400).send("pass too short or does not match");
			return;
		}

		const isRegistered = await checkIsRegistered(req.body.email);

		if (isRegistered) {
			res.status(400).send("this email already registered, try anotherone");
			return;
		}

		const { userName, password, email } = newUser;

		const hashedPass = await bcript.hash(password, 10);
		const result = await registerNewUser(
			null,
			userName,
			hashedPass,
			null,
			null,
			"email"
		);

		await sendConfirmEmailHelper(userName, email);

		res.end(result);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
};

module.exports = registerUser;
