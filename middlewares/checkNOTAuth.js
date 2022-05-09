const checkNOTAuth = (req, res, next) => {
  if (req.isAuthenticated()) res.redirect("/");
  return next();
};

module.exports = checkNOTAuth;
