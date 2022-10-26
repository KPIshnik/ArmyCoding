const { testmail, url } = require("../configs/credentials");
const sendEmailThred = require("../helpers/sendMailThred");
const superagent = require("superagent");
const request = require("supertest");

const express = require("express");

//migrateUP();

const app = express();

app.post("/", (req, res) => {
  console.log(req.body);
  res.redirect("/lola");
});
app.get("/lola", (req, res) => {
  res.status(200).json("lola");
});

const server = app.listen(8000, () => {
  console.log("go go go");
});

describe("ABC", () => {
  afterAll(() => {
    server.close();
  });

  test("huita test", async () => {
    const res0 = await request("http://localhost:8000").get("/lola");

    const res = await request("http://localhost:8000")
      .post("/")
      .send({ hi: "hi" })
      .redirects();

    console.log(res);

    expect(res.status).toBe(200);
    expect(res0.body).toBe("lola");
  });
});

// (async () => {
//     resp = await superagent.get("http://localhost:8000");

//     //const lastRecivedEmail = testmailResponse.emails[0];
//     console.log(resp.status);
//     console.log(resp.text);
//   })();
