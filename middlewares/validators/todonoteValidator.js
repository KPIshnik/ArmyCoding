const isUUIDvalid = require("../../helpers/isUUIDvalid");

const todonoteValidator = async (req, res, next) => {
  try {
    const { text, priority, done } = req.body;
    const listid = req.params.listid;
    req.body.valid = false;

    if (!isUUIDvalid(listid)) {
      res.status(400).json("valid list id required");
      return;
    }

    if (!text) {
      res.status(400).json("todo text reuired");
      return;
    }

    if (!(typeof done === "boolean")) {
      res.status(400).json("done should be boolean type");
      return;
    }

    if (!(typeof priority === "number")) {
      res.status(400).json("priority should be integer type");
      return;
    }
    req.body.valid = true;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = todonoteValidator;
