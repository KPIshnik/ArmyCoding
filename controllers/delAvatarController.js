const fs = require("fs");

const delAvatarConrtroller = (req, res) => {
  if (!req.user.username) {
    res.status(400).json("username required");
  }

  fs.promises
    .unlink(`public/avatars/${req.user.username + ".webp"}`)
    .then((data) => {
      console.log(`${req.user.username} avatar has been deleted`);
      res.status(200).json(`${req.user.username} avatar has been deleted`);
    })
    .catch((err) => {
      res.status(400).json("Deleting avatar faild");
      throw err;
    });
};

module.exports = delAvatarConrtroller;
