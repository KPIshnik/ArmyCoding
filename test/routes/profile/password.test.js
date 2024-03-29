const request = require("supertest");
const { url } = require("../../../configs/config");
const clearDB = require("../../../DB/clearDB");
const serverPromise = require("../../../server");
const registerNewUser = require("../../../models/registerNewUser");
const setUserPassword = require("../../../models/setUserPassword");

jest.mock("../../../models/setUserPassword", () =>
  jest.fn(jest.requireActual("../../../models/setUserPassword"))
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

let server;
let agent;
const tokens = {};

describe("password", () => {
  const testUser = {
    username: "testuser",
    password: "123",
    email: "testuser@test.app",

    newPassword: "1234",
  };

  beforeAll(async () => {
    server = await serverPromise;
    agent = request.agent(url);
    const id = await registerNewUser(
      testUser.email,
      testUser.username,
      testUser.password,
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
    setUserPassword.mockClear();
  });

  describe("tests with user not authirized", () => {
    describe("post request", () => {
      test("should responce with 401 status and 'not authorized' msg", async () => {
        //act
        const responce = await agent.put("/me/profile/password").send({
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

    test(`POST request, should change password, 
    and response with 200 code and 'password chenged' msg`, async () => {
      //act

      const response = await agent
        .put("/me/profile/password")
        .set("Authorization", `Bearer ${tokens.user.token}`)
        .send({
          password: testUser.password,
          newPass: testUser.newPassword,
          newPass2: testUser.newPassword,
        });

      const loginResp = await agent
        .post("/auth")
        .send({ email: testUser.email, password: testUser.newPassword });

      tokens.user = { ...loginResp.body };
      //assert
      expect(response.status).toBe(200);
      expect(response.body).toBe("password chenged");

      expect(loginResp.status).toBe(200);

      expect(setUserPassword).toHaveBeenCalled();
    });
  });

  test(`POST request, should NOT change password, 
    and response with 400 code and 'password required' msg`, async () => {
    const notValidPasses = ["", null, undefined];
    //act
    for (pass of notValidPasses) {
      const response = await agent
        .put("/me/profile/password")
        .set("Authorization", `Bearer ${tokens.user.token}`)
        .send({
          password: "",
          newPass: testUser.newPassword,
          newPass2: testUser.newPassword,
        });

      //assert
      expect(response.status).toBe(400);
      expect(response.body).toBe("password required");
      expect(setUserPassword).not.toHaveBeenCalled();
    }
  });

  test(`POST request, should NOT change password, 
    and response with 400 code and 'pass to short or doesn't match' msg`, async () => {
    //act

    const response = await agent
      .put("/me/profile/password")
      .set("Authorization", `Bearer ${tokens.user.token}`)
      .send({
        password: testUser.password,
        newPass: 123,
        newPass2: 1234,
      });

    //assert
    expect(response.status).toBe(400);
    expect(response.body).toBe("pass to short or doesn't match");
    expect(setUserPassword).not.toHaveBeenCalled();
  });

  test(`POST request, should NOT change password, 
  and response with 400 code and 'pass to short or doesn't match' msg`, async () => {
    //act

    const response = await agent
      .put("/me/profile/password")
      .set("Authorization", `Bearer ${tokens.user.token}`)
      .send({
        password: "fakepassword",
        newPass: testUser.newPassword,
        newPass2: testUser.newPassword,
      });

    //assert
    expect(response.status).toBe(400);
    expect(response.body).toBe("wrong pass");
    expect(setUserPassword).not.toHaveBeenCalled();
  });
});

//ERROR HANDLE!!
