const checkNOTAuth = (req, res, next) => {
  try {
    const x = req.isAuthenticated();
    if (x) res.redirect("/");

    return next();
  } catch (err) {
    next(err);
  }
};

module.exports = checkNOTAuth;
