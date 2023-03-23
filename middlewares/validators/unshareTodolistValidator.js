const unshareTodolistValidator = async (req, res, next) => {
  try {
    const { email } = req.query;
    req.body.valid = false;

    if (!(typeof email === "string")) {
      res.status(400).json("valid email required");
      return;
    }

    req.body.valid = true;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = unshareTodolistValidator;
