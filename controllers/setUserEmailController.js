const bcript = require("bcrypt");
const verifyPassword = require("../models/verifyPassword");
const setUserEmail = require("../models/setUserEmail");
const checkUniqueUserEmail = require("../models/checkUniqueUserEmail");
const sendConfirmEmailHelper = require("../helpers/sendConfirmEmailHelper");

const setUserEmailController = async (req, res) => {
	const userPass = req.body.password;
	const userEmail = req.body.email;
	const user = req.user;

	if (!userPass) {
		res.send("password required");
		return;
	}

	if (!userEmail) {
		res.send("email required");
		return;
	}

	try {
		if (await checkUniqueUserEmail(userEmail)) {
			res.send("email should be unique");
			return;
		}

		if (!(await verifyPassword(user, userPass))) {
			res.send("wrong pass");
			return;
		}

		await sendConfirmEmailHelper(user.username, userEmail);

		res.send(`cofirm email`); // redirect to something norml later
	} catch (err) {
		console.log(err);
		res.send("server error");
	}
};

module.exports = setUserEmailController;
