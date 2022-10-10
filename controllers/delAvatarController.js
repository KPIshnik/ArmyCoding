const fs = require("fs");

const delAvatarConrtroller = (res, req) => {
  if (!req.user.username) {
    res.status(400).json("username required");
  }

  //how to mock path for fs.unlink

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
