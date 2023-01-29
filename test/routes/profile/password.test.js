const request = require("supertest");
const { url } = require("../../../configs/credentials");
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

describe("/profile/avatar", () => {
  const testUser = {
    userName: "testuser",
    password: "123",
    email: "testuser@test.app",

    newPassword: "1234",
  };

  beforeAll(async () => {
    server = await serverPromise;
    agent = request.agent(url);
    const id = await registerNewUser(
      testUser.email,
      testUser.userName,
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
    describe("get request", () => {
      test("should response with 401 status and 'not authorized' msg", async () => {
        //act
        const response = await agent.get("/profile/password").redirects();

        //assert
        expect(response.status).toBe(200);
        expect(response.body).toBe("register page");
      });
    });

    describe("post request", () => {
      test("should responce with 401 status and 'not authorized' msg", async () => {
        //act
        const responce = await agent.post("/profile/password").send({
          password: testUser.password,
          newPass: testUser.newPassword,
          newPass2: testUser.newPassword,
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

    test("GET requst. Should response with 200 code and 'pass page' msg", async () => {
      //act
      const response = await agent.get(`/profile/password`);

      //assert
      expect(response.status).toBe(200);
      expect(response.body).toBe("pass page");
    });

    test(`POST request, should change password, 
    and response with 200 code and 'password chenged' msg`, async () => {
      //act

      const response = await agent.post("/profile/password").send({
        password: testUser.password,
        newPass: testUser.newPassword,
        newPass2: testUser.newPassword,
      });

      const delResp = await agent.delete("/auth");

      const loginResp = await agent
        .post("/auth")
        .send({ email: testUser.email, password: testUser.newPassword })
        .redirects();

      //assert
      expect(response.status).toBe(200);
      expect(response.body).toBe("password chenged");

      expect(delResp.status).toBe(200);
      expect(delResp.body).toBe("loged out");

      expect(loginResp.status).toBe(200);
      expect(loginResp.body).toBe(`Aloha ${testUser.userName}!`);

      expect(setUserPassword).toHaveBeenCalled();
    });
  });

  test(`POST request, should NOT change password, 
    and response with 400 code and 'password required' msg`, async () => {
    const notValidPasses = ["", null, undefined];
    //act
    for (pass of notValidPasses) {
      const response = await agent.post("/profile/password").send({
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
    const notValidPasses = ["", null, undefined];
    //act

    const response = await agent.post("/profile/password").send({
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
    const notValidPasses = ["", null, undefined];
    //act

    const response = await agent.post("/profile/password").send({
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
