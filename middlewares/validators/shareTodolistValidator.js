const shareTodolistValidator = async (req, res, next) => {
  const { emails } = req.body;
  req.body.valid = false;

  for (const email of emails) {
    if (!(typeof email === "string")) {
      res.status(400).json("valid emails required");
      return;
    }
  }
  req.body.valid = true;
  next();
};

module.exports = shareTodolistValidator;
