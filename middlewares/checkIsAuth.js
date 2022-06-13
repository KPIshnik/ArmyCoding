const getUserByEmail = require("../models/getUserByEmail");

const checkIsAuth = (req, res, next) => {
  console.log(req.user);
  console.log(req.url != "/user/username");
  if (!req.isAuthenticated()) {
    res.status(401).redirect("/login");
    return;
  }

  if (!req.user.username & (req.url != "/user/username")) {
    res.status(401).redirect("/user/username"); //или типа того
    return;
  }
  next();
};

module.exports = checkIsAuth;
