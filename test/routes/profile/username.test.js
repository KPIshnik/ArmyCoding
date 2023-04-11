const request = require("supertest");
const { url, testmail } = require("../../../configs/credentials");
const clearDB = require("../../../DB/clearDB");
const serverPromise = require("../../../server");
const registerNewUser = require("../../../models/registerNewUser");
const setUserPassword = require("../../../models/setUserPassword");
const superagent = require("superagent");
const setUserName = require("../../../models/setUserName");

jest.mock("../../../models/setUserName", () =>
  jest.fn(jest.requireActual("../../../models/setUserName"))
);

jest.mock("bcrypt", () => {
  const originalBcript = jest.requireActual("bcrypt");
  return {
    ...originalBcript,
    compare: (pass1, pass2) => {
      return pass1 === pass2;
    },
    hash: (pass) => pass,
  };
});

jest.setTimeout(30000);

let server;
let agent;
let agent2;

describe("username routine", () => {
  const testUser = {
    username: "testuser",
    password: "123",
    email: "testuser@test.app",

    newUsername: "newName",
    doubleName: "doubleName",
  };

  const testUser2 = {
    username: "testuser2",
    password: "123",
    email: "testuser2@test.app",
  };

  beforeAll(async () => {
    server = await serverPromise;
    agent = request.agent(url);
    agent2 = request.agent(url);

    testUser.id = await registerNewUser(
      testUser.email,
      testUser.username,
      testUser.password,
      null,
      null,
      "email"
    );
    await registerNewUser(
      "double@mail",
      testUser.doubleName,
      "doublepass",
      null,
      null,
      "email"
    );

    await registerNewUser(
      testUser2.email,
      testUser2.username,
      testUser2.password,
      null,
      null,
      "email"
    );
  });

  afterAll(async () => {
    await clearDB();
    await server.teardown();
  });

  afterEach(() => {
    setUserName.mockClear();
  });

  describe("tests with user not authirized", () => {
    describe("get request", () => {
      test("should response with 200 status and 'register page' msg", async () => {
        //act
        const response = await agent.get("/me/profile/username").redirects();

        //assert
        expect(response.status).toBe(200);
        expect(response.body).toBe("register page");
      });
    });

    describe("post request", () => {
      test("should responce with 401 status and 'not authorized' msg", async () => {
        //act
        const responce = await agent.post("/me/profile/username").send({
          password: testUser.password,
          username: testUser.newUsername,
        });

        //assert
        expect(responce.status).toBe(401);
        expect(responce.body).toBe("not authorized");
      });
    });
  });

  describe("tests for authorized user", () => {
    beforeAll(async () => {
      await agent
        .post(`/auth`)
        .send({ email: testUser.email, password: testUser.password });
    });

    test("GET requst. Should response with 200 code and 'username page' msg", async () => {
      //act
      const response = await agent.get(`/me/profile/username`);

      //assert
      expect(response.status).toBe(200);
      expect(response.body).toBe("username page");
    });

    test(`POST request, should change email,
          and response with 200 code and 'username chenged' msg`, async () => {
      //act

      const response = await agent.post("/me/profile/username").send({
        password: testUser.password,
        username: testUser.newUsername,
      });

      await agent.delete("/auth");

      const loginResp = await agent
        .post("/auth")
        .send({ email: testUser.email, password: testUser.password })
        .redirects();

      //assert
      expect(response.status).toBe(200);
      expect(response.body).toBe("username changed");

      expect(loginResp.status).toBe(200);
      expect(loginResp.body).toBe(`Aloha ${testUser.newUsername}!`);
    });

    test(`POST request, should NOT change username,
            and response with 400 code and 'password required' msg`, async () => {
      const notValidPasses = ["", null, undefined];
      //act
      for (pass of notValidPasses) {
        const response = await agent.post("/me/profile/username").send({
          username: testUser.username,
          password: pass,
        });

        //assert
        expect(response.status).toBe(400);
        expect(response.body).toBe("password required");
        expect(setUserName).not.toHaveBeenCalled();
      }
    });

    test(`POST request, should NOT change username,
              and response with 400 code and "username required" msg`, async () => {
      const notValidUsernames = ["", null, undefined];
      //act
      for (username of notValidUsernames) {
        const response = await agent.post("/me/profile/username").send({
          username,
          password: testUser.password,
        });

        //assert
        expect(response.status).toBe(400);
        expect(response.body).toBe("username required");
        expect(setUserName).not.toHaveBeenCalled();
      }
    });

    test(`POST request, should NOT change username,
            and response with 400 code and "wrong pass" msg`, async () => {
      //act

      const response = await agent.post("/me/profile/username").send({
        password: "fakepassword",
        username: "uniqueusername@mail",
      });

      //assert
      expect(response.status).toBe(401);
      expect(response.body).toBe("wrong pass");
      expect(setUserName).not.toHaveBeenCalled();
    });

    test(`POST request, should NOT change username,
            and response with 400 code and "username should be unique" msg`, async () => {
      //act

      const response = await agent.post("/me/profile/username").send({
        password: testUser.password,
        username: testUser.doubleName,
      });

      //assert
      expect(response.status).toBe(400);
      expect(response.body).toBe("username should be unique");
      expect(setUserName).not.toHaveBeenCalled();
    });

    test(`get request, should get username of another user`, async () => {
      //arrange
      await agent2.post("/auth").send(testUser2);
      //act

      const response = await agent2.get(
        `/users/${testUser.id}/profile/username`
      );

      //assert
      expect(response.status).toBe(200);
      expect(response.body).toBe(testUser.newUsername);
    });
  });
});

//ERROR HANDLE!!
