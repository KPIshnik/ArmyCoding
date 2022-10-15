const sgMail = require("@sendgrid/mail");
const { sendGridKeys } = require("../configs/credentials");

sgMail.setApiKey(sendGridKeys.API_KEY);

const sendEmail = async (adress, subject, content) => {
  const msg = {
    to: adress,
    from: "dimoglo.anton@gmail.com", // Use the email address or domain you verified above
    subject: subject,
    html: content,
  };
  //??? await & then?? fix this
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = sendEmail;
