const sendEmailThred = require("./helpers/sendMailThred");
const bcript = require("bcrypt");
const start = (async () => {
  const hashedId = await bcript.hash("1", 10);

  const content = `http://localhost:3000/confirmEmail?id=${hashedId}`;

  sendEmailThred("antaresstat@gmail.com", "Huita in progress", content);
})();
