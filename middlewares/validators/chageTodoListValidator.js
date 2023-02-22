const changeTodoListValidator = async (req, res, next) => {
  req.body.valid = false;
  const { listid, lastUpdateTimestamp, listname, todos } = req.body;

  if (!listid) {
    res.status(400).json("listid required");
    return;
  }

  if (!listname) {
    res.status(400).json("listname required");
    return;
  }

  if (!lastUpdateTimestamp) {
    res.status(400).json("list last update timestamp required");
    return;
  }

  if (todos) {
    for (let todo of todos) {
      if (!todo.text || !todo.priority || !(typeof todo.done === "boolean")) {
        res.status(400).json("request not valid");
        return;
      }
    }
  }

  req.body.valid = true;
  next();
};

module.exports = changeTodoListValidator;
