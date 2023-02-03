const logoutController = (req, res) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }

    res.status(200).json("loged out");
  });
};

module.exports = logoutController;
