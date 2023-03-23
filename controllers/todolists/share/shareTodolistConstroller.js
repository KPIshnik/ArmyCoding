const shareTodolistHelper = require("../../../helpers/shareTodolistHelper");

const shareTodolistController = async (req, res, next) => {
  try {
    let { listid, emails, valid } = req.body;
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
