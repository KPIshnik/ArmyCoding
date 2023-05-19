const express = require("express");
const router = require("./routes");
const swaggerUi = require("swagger-ui-express");
const swagger = require("./swagger.json");
const cookieParser = require("cookie-parser");
const errLog = require("./middlewares/Errlog");

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));
app.use(cookieParser());
app.use(
  express.static("public", {
    extensions: ["webp"],
  })
);

app.use(router);
app.use(errLog);

module.exports = app;
