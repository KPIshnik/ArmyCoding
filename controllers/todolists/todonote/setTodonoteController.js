const { setRank } = require("../../../helpers/setRank");
const createTodos = require("../../../models/todilists/createTodos");
const getTodosByListId = require("../../../models/todilists/getTodosByListId");
const updateTodos = require("../../../models/todilists/updateTodos");

const setTodonoteController = async (req, res, next) => {
  try {
    const { listid, text, priority, done, valid } = req.body;
    if (!valid) {
      throw new Error("request data not valid");
    }

    const todos = await getTodosByListId(listid);

    let rank = setRank(todos, priority);

    if (
      rank <= 1 ||
      rank >= 2147483647 ||
      (priority <= todos.length &&
        priority >= 2 &&
        rank === todos[priority - 2].rank)
    ) {
      todos.splice(priority - 1, 0, { listid, text, rank, done });
      todos.forEach((t, i) => (t.rank = (i + 1) * 1000000));

      rank =
        priority > todos.length - 1
          ? todos[todos.length - 1].rank
          : todos[priority - 1].rank;

      await updateTodos(todos.filter((t) => t.id));
    }

    const idArr = await createTodos(listid, [{ text, rank, done }]);

    return res.status(200).json({ msg: "todonote created", id: idArr[0].id });
  } catch (err) {
    next(err);
  }
};

module.exports = setTodonoteController;
