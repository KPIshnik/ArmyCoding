const getUserByEmail = require("../models/getUserByEmail");

const checkIsAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(401).redirect("/auth");
    return;
  }

  console.log(req.user);

  if (!req.user.confirmed) {
    res.end("confirm email");
    return;
  }

  if (!req.user.username & (req.url != "/profile/username")) {
    res.status(401).redirect("/profile/username"); //или типа того
    return;
  }
  next();
};

module.exports = checkIsAuth;
