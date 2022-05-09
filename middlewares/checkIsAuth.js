const checkIsAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).redirect("/login");
};

module.exports = checkIsAuth;
