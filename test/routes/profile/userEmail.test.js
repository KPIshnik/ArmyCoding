const request = require("supertest");
const { testmail } = require("../../../configs/credentials");
const clearDB = require("../../../DB/clearDB");
const serverPromise = require("../../../server");
const registerNewUser = require("../../../models/registerNewUser");
const superagent = require("superagent");
const confirmEmailHelper = require("../../../helpers/confirmEmailHelper");
const { url } = require("../../../configs/config");

jest.mock("../../../helpers/confirmEmailHelper", () =>
  jest.fn(jest.requireActual("../../../helpers/confirmEmailHelper"))
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
const tokens = {};

describe("useremail", () => {
  const testUser = {
    username: "testuser",
    password: "123",
    email: "testuser@test.app",

    newEmail: "a2f9p.testuser@inbox.testmail.app",
    doubleEmail: "double@email",
  };

  beforeAll(async () => {
    server = await serverPromise;
    agent = request.agent(url);
    await registerNewUser(
      testUser.email,
      testUser.username,
      testUser.password,
      null,
      null,
      "email"
    );
    await registerNewUser(
      testUser.doubleEmail,
      "doubleuser",
      "doublrpass",
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
    confirmEmailHelper.mockClear();
  });

  describe("tests with user not authirized", () => {
    describe("put request", () => {
      test("should responce with 401 status and 'not authorized' msg", async () => {
        //act
        const responce = await agent.put("/me/profile/email").send({
          password: testUser.password,
          newPass: testUser.newPassword,
          newPass2: testUser.newPassword,
        });

        //assert
        expect(responce.status).toBe(401);
      });
    });
  });

  describe("tests for authorized user", () => {
    beforeAll(async () => {
      const login = await agent
        .post(`/auth`)
        .send({ email: testUser.email, password: testUser.password });
      tokens.user = { ...login.body };
    });

    test(`put request, should change email,
        and response with 200 code and 'email chenged' msg`, async () => {
      //act

      const response = await agent
        .put("/me/profile/email")
        .set("Authorization", `Bearer ${tokens.user.token}`)
        .send({
          password: testUser.password,
          email: testUser.newEmail,
        });

      const testmailResponse = await superagent.get(
        `https://api.testmail.app/api/json?apikey=${
          testmail.api_key
        }&namespace=${testmail.namespace}&tag=${
          testUser.username
        }&timestamp_from=${Date.now()}&livequery=true`
      );

      const lastRecivedEmail = testmailResponse.body.emails[0];
      const confirmEmailURL = `${lastRecivedEmail.text}`;

      const confirmEmailResponse = await request(confirmEmailURL).get("");

      await agent.delete("/auth");

      const loginResp = await agent
        .post("/auth")
        .send({ email: testUser.newEmail, password: testUser.password });

      tokens.user = { ...loginResp.body };

      //assert
      expect(response.status).toBe(200);
      expect(response.body).toBe("confirm new email");

      expect(confirmEmailResponse.status).toBe(200);

      expect(loginResp.status).toBe(200);
    });

    test(`put request, should NOT change email,
      and response with 400 code and 'password required' msg`, async () => {
      const notValidPasses = ["", null, undefined];
      //act
      for (pass of notValidPasses) {
        const response = await agent
          .put("/me/profile/email")
          .set("Authorization", `Bearer ${tokens.user.token}`)
          .send({
            email: testUser.email,
            password: pass,
          });

        //assert
        expect(response.status).toBe(400);
        expect(response.body).toBe("password required");
        expect(confirmEmailHelper).not.toHaveBeenCalled();
      }
    });

    test(`put request, should NOT change email,
        and response with 400 code and "email required" msg`, async () => {
      const notValidEmails = ["", null, undefined];
      //act
      for (email of notValidEmails) {
        const response = await agent
          .put("/me/profile/email")
          .set("Authorization", `Bearer ${tokens.user.token}`)
          .send({
            email,
            password: testUser.password,
          });

        //assert
        expect(response.status).toBe(400);
        expect(response.body).toBe("email required");
        expect(confirmEmailHelper).not.toHaveBeenCalled();
      }
    });

    test(`put request, should NOT change email,
      and response with 400 code and "wrong pass" msg`, async () => {
      //act

      const response = await agent
        .put("/me/profile/email")
        .set("Authorization", `Bearer ${tokens.user.token}`)
        .send({
          password: "fakepassword",
          email: "uniqueEmail@mail",
        });

      //assert
      expect(response.status).toBe(401);
      expect(response.body).toBe("wrong pass");
      expect(confirmEmailHelper).not.toHaveBeenCalled();
    });

    test(`put request, should NOT change email,
      and response with 400 code and "email should be unique" msg`, async () => {
      //act

      const response = await agent
        .put("/me/profile/email")
        .set("Authorization", `Bearer ${tokens.user.token}`)
        .send({
          password: testUser.password,
          email: testUser.doubleEmail,
        });

      //assert
      expect(response.status).toBe(400);
      expect(response.body).toBe("email should be unique");
      expect(confirmEmailHelper).not.toHaveBeenCalled();
    });
  });
});
