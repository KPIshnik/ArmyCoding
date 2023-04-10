const checkIsAuth = (req, res, next) => {
  try {
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

    if (!req.user.username & (req.url != "/me/profile/username")) {
      res.redirect("/me/profile/username");
      return;
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = checkIsAuth;
