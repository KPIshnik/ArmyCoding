const express = require("express");
const session = require("express-session");
const passport = require("./middlewares/passport");
const router = require("./routes");
const swaggerUi = require("swagger-ui-express");
const swagger = require("./swagger.json");
const { session_config } = require("./configs/credentials");
const errLog = require("./middlewares/Errlog");

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));

app.use(session(session_config));
app.use(
  express.static("public", {
    extensions: ["webp"],
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(router);
app.use(errLog);

module.exports = app;
