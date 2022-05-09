const sgMail = require("@sendgrid/mail");
const API_KEY =
  "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";

sgMail.setApiKey(API_KEY);

const sendEmail = async (adress, subject, content) => {
  const msg = {
    to: adress, // adress,
    from: "antaresstat@gmail.com", // Use the email address or domain you verified above
    subject: subject, //subject,
    html: content, //content,
  };
  await sgMail
    .send(msg)
    .then(() => {
      // console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = sendEmail;
