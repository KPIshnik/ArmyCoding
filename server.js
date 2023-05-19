const fs = require("fs");
const http = require("http");
const https = require("https");
const app = require("./app");
const db = require("./DB/db");
const migrateUp = require("./DB/migrateUP");
const { PORT, HOST } = require("./configs/config");

// const privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
// const certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

//const credentials = {key: privateKey, cert: certificate};

const startServer = async () => {
  await migrateUp();
  server = http.createServer(app).listen(PORT, HOST, () => {
    console.log(`server started at ${PORT}`);
  });

  // const server = https.createServer(credentials, app).listen(PORT, HOST, () => {
  //   console.log(`server started at ${PORT}`);
  // });

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

  server.teardown = teardown;

  return server;
};

module.exports = startServer();
