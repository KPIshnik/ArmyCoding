const sendEmailThred = require("../../../helpers/sendMailThred");
const getUsersIdsByEmails = require("../../../models/getUsersIdsByEmails");
const getUserTodoListDataById = require("../../../models/todilists/getTodoLIstDataById");
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
  const listData = await getUserTodoListDataById(listid);

  const emailSubject = "todolists app. New access granted";
  const emailText = `user ${user.username} shred "${listData.listname}" todolist with you`;

  usersEmailArr.forEach((email) => {
    sendEmailThred(email, emailSubject, emailText);
  });

  res.status(200).json(`list ${listid} shared `);
};

module.exports = shareTodolistController;
