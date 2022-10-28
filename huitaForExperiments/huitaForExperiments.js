const { testmail, url } = require("../configs/credentials");
const sendEmailThred = require("../helpers/sendMailThred");
const superagent = require("superagent");
const request = require("supertest");

const express = require("express");

//migrateUP();

const app = express();
let k;

app.get("/", (req, res) => {
  k = 8;
  res.redirect("/lola");
});

app.get("/lola", (req, res) => {
  k = 10;
  res.status(200).json({ l: "lola" });
});

app.listen(8000, () => {
  console.log("go go go");
  console.log(k);
});

request(app).get("/");

// test("huita test", () => {
//   request(app).get("/").expect(200);
// });
// (async () => {
//     resp = await superagent.get("http://localhost:8000");

//     //const lastRecivedEmail = testmailResponse.emails[0];
//     console.log(resp.status);
//     console.log(resp.text);
//   })();
