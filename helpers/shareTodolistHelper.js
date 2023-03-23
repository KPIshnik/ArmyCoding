const sendEmailThred = require("./sendMailThred");
const getUsersIdsAndEmailsByEmails = require("../models/getUsersIdsAndEmailsByEmails");
const getUserTodoListDataById = require("../models/todilists/getTodoLIstDataById");
const getUsersWithAccessIdsByListid = require("../models/todilists/share/getUsersWithAccessIdsByListid");
const shareTodolistWithUsers = require("../models/todilists/share/shareTodolistWthUsers");

const shareTodolistHelper = async (listid, emails, user) => {
  const usersIdsAndEmails = await getUsersIdsAndEmailsByEmails(emails);

  const usersIds = usersIdsAndEmails.map((u) => u.id);
  emails = usersIdsAndEmails.map((u) => u.email);

  const usersWitAccessIdsArr = await getUsersWithAccessIdsByListid(listid);

  usersToShareIds = usersIds.filter(
    (id) => usersWitAccessIdsArr.indexOf(id) === -1
  );

  const listData = await getUserTodoListDataById(listid);

  await shareTodolistWithUsers(listid, listData.listname, usersToShareIds);
  const emailSubject = "todolists app. New access granted";
  const emailText = `user ${user.username} shred "${listData.listname}" todolist with you`;

  emails.forEach((email) => {
    sendEmailThred(email, emailSubject, emailText);
  });
  return usersIds;
};
module.exports = shareTodolistHelper;
