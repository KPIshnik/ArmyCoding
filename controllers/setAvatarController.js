const sharp = require("sharp");

const setAvatarConrtroller = (req, res) => {
  const fileName = req.user.username + ".webp";

  sharp(req.file.buffer)
    .webp()
    .toFile(`public/avatars/${fileName}`)
    .then(() => res.status(201).json("avatar is set"))
    .catch((err) => {
      console.log(err);
      res.status(500).json("Oops, sever error((");
    });
};

module.exports = setAvatarConrtroller;
