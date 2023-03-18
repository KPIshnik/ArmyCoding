const pool = require("../models/DBconnection");

pool
  .query("Select name from test where name=$1 and email=$2", ["1", "0"])
  .then((res) => {
    console.log(res.rows[0] ? true : false);
  });
