const shareTodolistHelper = require("../../../helpers/shareTodolistHelper");

const shareTodolistController = async (req, res, next) => {
  try {
    const { emails, valid } = req.body;
    const listid = req.params.id;

    if (!valid) {
      throw new Error("request data not valid");
    }
    const user = req.user;

    await shareTodolistHelper(listid, emails, user);

    res.status(200).json(`list ${listid} shared `);
  } catch (err) {
    next(err);
  }
};

module.exports = shareTodolistController;
