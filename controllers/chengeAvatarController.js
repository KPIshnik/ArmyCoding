const fs = require("fs");
const sharp = require("sharp");

const chengeAvatarConrtroller = (res, req) => {
	const fileName = req.user.username + ".webp";
console.log(fileName)
	fs.promises
		.unlink(`public/avatars/${fileName}`)
		.then((data) => {
			console.log(`${req.user.username} avatar has been deleted`);
		})
		.then(
			sharp(req.file.buffer)
				.webp()
				.toFile(`public/avatars/${fileName}`)
				.then(() => res.send("avatar updated"))
				.catch((err) => {
					console.log(err);
					res.send("Oopsy");
				})
		)
        .catch((err) => {
			res.send("Deleting avatar faild");
			throw err;
		});
};

module.exports = chengeAvatarConrtroller;
