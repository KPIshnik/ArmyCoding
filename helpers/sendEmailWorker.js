const sendEmail = require("./sendEmail");
const { workerData, parentPort } = require("worker_threads");

const { adress, subject, content } = workerData;

sendEmail(adress, subject, content)
  .then((res) => {
    parentPort.postMessage("mail send");
  })
  .catch((err) => {
    throw err;
  });

module.exports = sendEmail;
