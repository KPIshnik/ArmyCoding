const getUsernameById = require("../models/getUsernameById");

const getUsernameController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const username = await getUsernameById(id);
    res.status(200).json(username);
  } catch (err) {
    next(err);
  }
};

module.exports = getUsernameController;
