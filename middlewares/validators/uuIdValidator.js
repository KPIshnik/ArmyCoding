const isUUIDvalid = require("../../helpers/isUUIDvalid");

const uuidValidator = async (req, res, next) => {
  req.body.valid = false;
  const id = req.params.id || req.query.id || req.body.id || req.body.listid;

  if (!isUUIDvalid(id)) {
    res.status(400).json("valid id required");
    return;
  }

  req.body.valid = true;
  next();
};

module.exports = uuidValidator;
