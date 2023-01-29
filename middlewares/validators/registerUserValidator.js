const registerUserValidator = async (req, res, next) => {
  const { password, newPass, newPass2 } = req.body;
  req.body.valid = false;

  req.body.valid = true;
  next();
};

module.exports = registerUserValidator;
