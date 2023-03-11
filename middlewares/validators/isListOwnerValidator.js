const getUserTodoListDataById = require("../../models/todilists/getTodoLIstDataById");

const isListOwnerValidator = async (req, res, next) => {
  req.body.valid = false;
  const listid = req.params.id || req.body.id;

  const listData = await getUserTodoListDataById(listid);

  if (!(listData.owner_id === req.user.id)) {
    res.status(400).body("access denied");
  }
  req.body.valid = true;
  next();
};

module.exports = isListOwnerValidator;
