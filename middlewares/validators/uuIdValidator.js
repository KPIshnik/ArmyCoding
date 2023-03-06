const isUUIDvalid = require("../../helpers/isUUIDvalid");

const uuidValidator = async (req, res, next) => {
  req.body.valid = false;
  const id = req.params.id;

  if (!isUUIDvalid(id)) {
    res.status(400).json("valid id required");
    return;
  }

  req.body.valid = true;
  next();
};

module.exports = uuidValidator;
