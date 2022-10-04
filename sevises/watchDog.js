const {
  cleaningDBInteval,
  confirmEmailExpireTime,
} = require("../configs/settings");
const deleteUnconfirmedUsers = require("../models/delUnconfirmedUsers");

const expiredDate = Date.now() - confirmEmailExpireTime;

const deleteTrashFromDBs = setInterval(async () => {
  const deletedUsers = await deleteUnconfirmedUsers(expiredDate);

  if (deletedUsers) console.log(`watchDog deleted ${deletedUsers}`);
}, cleaningDBInteval);

module.exports = deleteTrashFromDBs;
