const path = require("path");
const getUsernameById = require("../models/getUsernameById");
const fs = require("fs");

const getAvatarConrtroller = async (req, res, next) => {
  try {
    const username = req.user && req.user.username;

    isAvatar = fs.existsSync(
      path.join(__dirname, `../public/avatars/${username}.webp`)
    );

    if (!isAvatar) return res.sendStatus(404);

    res.sendFile(path.join(__dirname, `../public/avatars/${username}.webp`));
  } catch (err) {
    next(err);
  }
};

module.exports = getAvatarConrtroller;
