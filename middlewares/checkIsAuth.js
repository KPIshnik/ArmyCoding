const getUserByEmail = require("../models/getUserByEmail");

const checkIsAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(401).redirect("/auth");
    return;
  }

  console.log(req.user);

  // if not user.email
  if (!req.user.emil) {
    res.satus(403).send("confirm email");
    return;
  }

  if (!req.user.username & (req.url != "/profile/username")) {
    res.status(401).redirect("/profile/username"); //или типа того
    return;
  }
  next();
};

module.exports = checkIsAuth;
