const getListLastUpdateTimestamp = require("../../models/todilists/getListLastUpdateTimestamp");
const getTodoList = require("../../models/todilists/getTodosByListId");

const changeTodoListController = async (req, res) => {
  const { listId, listname, lastUpdateTimestamp, todos, valid } = req.body;
  const user = req.user;

  if (!valid) {
    throw new Error("request data not valid");
  }
  const timestamp = await getListLastUpdateTimestamp(listId);
  const oldTodoist = await getTodoList(listId);

  if (!lastUpdateTimestamp === timestamp) {
    res.status(400).text("list changed before request").json(oldTodoist);
    return;
  }
};

module.exports = changeTodoListController;
