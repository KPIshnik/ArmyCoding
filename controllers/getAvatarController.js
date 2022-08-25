const getAvatarConrtroller = (req, res) => {
	res.redirect(`/avatars/${req.query.username}`);
};

module.exports = getAvatarConrtroller;
