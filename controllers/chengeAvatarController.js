const fs = require("fs");
const sharp = require("sharp");

const chengeAvatarConrtroller = (req, res, next) => {
  try {
    if (!req.user.username) {
      res.status(400).json("username required");
      return;
    }

    const fileName = req.user.username + ".webp";

    fs.promises
      .unlink(`public/avatars/${fileName}`)
      .then((data) => {
        console.log(`${req.user.username} avatar has been deleted`);
      })
      .then(
        sharp(req.file.buffer)
          .webp()
          .toFile(`public/avatars/${fileName}`)
          .then(() =>
            res.status(200).json(`avatar for ${req.user.username} updated`)
          )
      );
  } catch (err) {
    next(err);
  }
};

module.exports = chengeAvatarConrtroller;
