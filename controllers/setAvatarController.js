const sharp = require("sharp");

const setAvatarConrtroller = (req, res) => {
	const fileName = req.user.username + ".webp";
	console.log(req.file);

	sharp(req.file.buffer)
		.webp()
		.toFile(`public/avatars/${fileName}`)
		.then(() => res.send("avatar uploaded"))
		.catch((err) => {
			console.log(err);
			res.send("Oopsy");
		});
};

module.exports = setAvatarConrtroller;
