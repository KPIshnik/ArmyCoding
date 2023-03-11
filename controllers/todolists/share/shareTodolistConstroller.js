const getUsersIdsByEmails = require("../../../models/getUsersIdsByEmails");
const shareTodolistWithUsers = require("../../../models/todilists/share/shareTodolistWthUsers");

const shareTodolistController = async (req, res) => {
  const { listid, usersEmailArr, valid } = req.body;
  //   if (!valid) {
  //     throw new Error("request data not valid");
  //   }
  const user = req.user;
  const filteredUsersEmailArr = usersEmailArr.filter(
    (email) => !(user.email === email)
  );

  const usersIdArr = await getUsersIdsByEmails(filteredUsersEmailArr);
  await shareTodolistWithUsers(listid, usersIdArr);

  //!!!!send email

  res.status(200).json(`list ${listid} shared `);
};

module.exports = shareTodolistController;
