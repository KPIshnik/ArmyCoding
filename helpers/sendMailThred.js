const {
  Worker,
  isMainThread,
  workerData,
  parentPort,
} = require("worker_threads");
const path = require("path");

const sendEmailThred = (adress, subject, content) => {
  return new Promise((resolve, reject) => {
    const workerScript = path.join(__dirname, "./sendEmailWorker.js");

    const worker = new Worker(workerScript, {
      workerData: { adress, subject, content },
    });

    worker.on("message", (message) => resolve(message));
    worker.on("error", (err) => reject(err));
  });
};

module.exports = sendEmailThred;
