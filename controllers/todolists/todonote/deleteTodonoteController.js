const deleteTodos = require("../../../models/todilists/deleteTodos");

const deleteTodonoteController = async (req, res, next) => {
  try {
    const id = req.params.id;

    const text = await deleteTodos([id]);

    text[0] ? res.status(200).json("deleted") : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
};

module.exports = deleteTodonoteController;
