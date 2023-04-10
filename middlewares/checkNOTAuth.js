const checkNOTAuth = (req, res, next) => {
  try {
    const x = req.isAuthenticated();
    if (x) return res.redirect("/");

    return next();
  } catch (err) {
    next(err);
  }
};

module.exports = checkNOTAuth;
