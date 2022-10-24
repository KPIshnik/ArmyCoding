const { testmail } = require("../configs/credentials");
const sendEmailThred = require("../helpers/sendMailThred");
const superagent = require("superagent");

(async () => {
  const res = await superagent.get(
    `https://api.testmail.app/api/json?apikey=${testmail.api_key}&namespace=${testmail.namespace}&tag=testuser`
  );

  const emails = res.body.emails;
  console.log(emails[0].text);

  //   emails.forEach((e) => {
  //     console.log(e.text);
  //   });

  console.log(emails[emails.length - 1].text);
})();
//const recivedMail = res.emails[res.emails.length - 1];
