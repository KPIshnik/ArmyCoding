const sharp = require("sharp");

const setAvatarConrtroller = (req, res) => {
  const fileName = req.user.username + ".webp";
  console.log(req.file);

  sharp(req.file.buffer)
    .webp()
    .toFile(`public/avatars/${fileName}`)
    .then(() => res.setStatus(201).json("avatar is set"))
    .catch((err) => {
      console.log(err);
      res.setStatus(201).json("Oops, sever error((");
    });
};

module.exports = setAvatarConrtroller;
