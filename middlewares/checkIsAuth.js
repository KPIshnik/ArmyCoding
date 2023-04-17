const checkIsAuth = (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.status(401).json("not authorized");

      return;
    }

    if (!req.user.email) {
      res.status(401).json("confirm email");
      return;
    }

    if (!req.user.username & (req.url != "/me/profile/username")) {
      res.status(401).json("set username");

      return;
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = checkIsAuth;
