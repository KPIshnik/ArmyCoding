const fs = require("fs");
const sharp = require("sharp");

const chengeAvatarConrtroller = (res, req) => {
  const fileName = req.user.username + ".webp";

  if (!req.user.username) {
    res.status(400).json("username required");
  }

  fs.promises
    .unlink(`public/avatars/${fileName}`)
    .then((data) => {
      console.log(`${req.user.username} avatar has been deleted`);
    })
    .then(
      //mock file.buffer? && path??
      sharp(req.file.buffer)
        .webp()
        .toFile(`public/avatars/${fileName}`)
        .then(() =>
          res.status(200).json(`avatar for ${req.user.username} updated`)
        )
        .catch((err) => {
          res.status(400).json("chenging avatar failed");
          throw err;
        })
    )
    .catch((err) => {
      res.status(400).json("chenging avatar failed");
      throw err;
    });
};

module.exports = chengeAvatarConrtroller;
