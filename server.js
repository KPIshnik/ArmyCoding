const app = require("./app");
const { PORT, HOST } = require("./configs/connectionConfig");

app.listen(PORT, HOST, () => {
  console.log(`server started at ${PORT}`);
});
