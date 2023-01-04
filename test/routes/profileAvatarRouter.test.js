const request = require("supertest");
const { url, testmail } = require("../../configs/credentials");
const clearDB = require("../../DB/clearDB");
const getEmailConfirmDataById = require("../../models/getEmailConfirmDataById");
const getUserByUserName = require("../../models/getUserByUsename");
const serverPromise = require("../../server");
const superagent = require("superagent");
const clearDbTables = require("../../DB/clearDbTables");
const { response } = require("../../app");
const registerNewUser = require("../../models/registerNewUser");
const fs = require("fs");
const path = require("path");
const { hasUncaughtExceptionCaptureCallback } = require("process");

//imitate registered userr???

let server;
let agent;

describe("/profile/avatar ", () => {
  const testUser = {
    userName: "testuser",
    password: "123",
    password2: "123",
    email: "a2f9p.testuser@inbox.testmail.app",
  };

  beforeAll(async () => {
    server = await serverPromise;
    agent = request.agent(url);
  });

  beforeEach(async () => {
    await clearDbTables();
  });

  afterAll(async () => {
    await clearDB();
    await server.teardown();
  });
  describe("get request", () => {
    // should responce with 200 buffer with avatar pictuire for usrname in query
    // or 404 not found if there is no avatar for that name

    test("should responce with 200 buffer with avatar picture for username", () => {});
  });

  describe("tests for there is NO avatar case", () => {
    describe("get request", () => {
      test("should responce with 404 not found if there is no avatar for that name", async () => {
        //act
        const request = await agent
          .get("/profile/avatar?username=some_fake_username")
          .redirects();

        //assert
        expect(request.status).toBe(404);
      });
    });

    describe("post request", () => {
      test("should responce with 201 status and 'avatar is set' msg", async () => {});
    });
    describe("put request", () => {});

    describe("delete request", () => {});
  });

  describe("tests for there is avatar case", () => {
    beforeAll(async () => {
      const readbleStream = fs.createReadStream(
        path.join(__dirname, "..", "/img/testuserAvatarBlack.webp")
      );
      const writableStream = fs.createWriteStream(
        path.join(__dirname, "../..", "/public/avatars/testuser.webp")
      );

      readbleStream.pipe(writableStream);
    });

    describe("get request", () => {
      // should responce with 200 buffer with avatar pictuire for usrname in query
      test("should responce with 200 buffer with avatar picture for username", () => {});
    });

    describe("post request", () => {});
    describe("put request", () => {});
    describe("delete request", () => {});
  });
});
