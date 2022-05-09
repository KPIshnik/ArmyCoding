const {
  Worker,
  isMainThread,
  workerData,
  parentPort,
} = require("worker_threads");
const path = require("path");

const sendEmailThred = (adress, subject, content) => {
  const workerScript = path.join(__dirname, "./sendEmailWorker.js");

  const worker = new Worker(workerScript, {
    workerData: { adress, subject, content },
  });

  worker.on("message", (message) => console.log(message));
  worker.on("error", (err) => console.log(err));
};

module.exports = sendEmailThred;
