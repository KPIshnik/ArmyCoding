const fs = require("fs");

const delAvatarConrtroller = (res, req) => {
	fs.promises
		.unlink(`public/avatars/${req.user.username + ".webp"}`)
		.then((data) => {
			console.log(`${req.user.username} avatar has been deleted`);
			res.send(`${req.user.username} avatar has been deleted`);
		})
		.catch((err) => {
			res.send("Deleting avatar faild");
			throw err;
		});
};

module.exports = delAvatarConrtroller;
