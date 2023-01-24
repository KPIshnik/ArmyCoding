const logoutController = (req, res) => {
  let x = req.user;
  req.logOut((err) => {
    if (err) {
      return next(err);
    }

    res.status(200).json("loged out");
  });
};

module.exports = logoutController;
