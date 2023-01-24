const checkIsAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    if (req.method === "GET") {
      res.redirect("/auth");
      return;
    }

    res.status(401).json("not authorized");

    return;
  }

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
