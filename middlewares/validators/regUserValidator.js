const registerUserValidator = (req, res, next) => {
  const { userName, email, password, password2 } = req.body;

  if (!userName) {
    res.status(400).json("username missing");
    return;
  }

  if (!email) {
    res.status(400).json("email missing");
    return;
  }

  if (!password || password != password2) {
    res.status(400).json("pass too short or does not match");
    return;
  }

  next();
};
