const checkIsAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect("/auth");
    return;
  }

  console.log(req.user);

  if (!req.user.email) {
    res.status(200).json("confirm email");
    return;
  }

  if (!req.user.username & (req.url != "/profile/username")) {
    res.redirect("/profile/username"); //или типа того
    return;
  }
  next();
};

module.exports = checkIsAuth;
