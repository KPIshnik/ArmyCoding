const getTodonoteById = require("../../../models/todilists/todonote/getTodonoteById");

const getTodonoteController = async (req, res) => {
  const id = req.params.id;

  const todonote = await getTodonoteById(id);

  todonote ? res.status(200).json(todonote) : res.sendStatus(404);
};

module.exports = getTodonoteController;
