const app = require("./app");
const db = require("./DB/db");
const migrateUp = require("./DB/migrateUP");
const { PORT, HOST } = require("./configs/connectionConfig");

let server;

const teardown = async (signal) => {
  console.info(`${signal} signal received.`);
  console.log("Closing http server.");

  await server.close();
  console.log("Http server closed.");

  await db.end();
  console.log("db connection has ended");
};

process.on("SIGTERM", teardown);
process.on("SIGINT", teardown);
let startServer;

startServer = async () => {
  await migrateUp();
  server = app.listen(PORT, HOST, () => {
    console.log(`server started at ${PORT}`);
  });

  server.teardown = teardown;

  return server;
};

module.exports = startServer();

//server.teardown = teardown;
