const sharp = require("sharp");

const setAvatarConrtroller = (req, res, next) => {
  try {
    const fileName = req.user.username + ".webp";

    sharp(req.file.buffer)
      .webp()
      .toFile(`public/avatars/${fileName}`)
      .then(() => res.status(201).json("avatar is set"));
  } catch (err) {
    next(err);
  }
};

module.exports = setAvatarConrtroller;
