const checkNOTAuth = (req, res, next) => {
  const x = req.isAuthenticated();
  if (x) res.redirect("/");

  return next();
};

module.exports = checkNOTAuth;
