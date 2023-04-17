const fs = require("fs").promises;
const path = require("path");
const request = require("supertest");
const { url } = require("../../../configs/credentials");
const clearDB = require("../../../DB/clearDB");
const registerNewUser = require("../../../models/registerNewUser");
const serverPromise = require("../../../server");

jest.setTimeout(10000);

jest.mock("bcrypt", () => {
  const originalBcript = jest.requireActual("bcrypt");
  return {
    ...originalBcript,
    compare: (pass1, pass2) => {
      return pass1 === pass2;
    },
  };
});

jest.mock("../../../middlewares/checkIsAuth", () => {
  return (req, res, next) => {
    req.user = testUser;
    next();
  };
});

jest.mock("../../../models/getUserByEmail", () => {
  return () => {
    throw new Error("Register err");
  };
});
jest.mock("../../../helpers/checkIsRegistered", () => {
  return () => {
    throw new Error("Auth err");
  };
});

jest.mock("../../../helpers/sendMailThred", () => {
  return () => {
    throw new Error("Register err");
  };
});

const agent = request.agent(url);

let server;

const testUser = {
  username: "testuser",
  password: "123",
  password2: "123",

  email: "a2f9p.testuser@inbox.testmail.app",
};

const pathToLog = path.join(__dirname, "../../../log/errlog.txt");

describe("error handling test", () => {
  beforeAll(async () => {
    server = await serverPromise;
  });

  beforeEach(() => {
    jest.resetModules();
  });

  afterAll(async () => {
    await clearDB();
    await server.teardown();
    await fs.writeFile(pathToLog, "");
  });
  test("set email test", async () => {
    //arrange
    logdata = await fs.stat(pathToLog);
    await registerNewUser(
      testUser.email,
      testUser.username,
      testUser.password,
      null,
      null,
      "email"
    );
    await agent.post("/auth").send(testUser);

    //act
    const res = await agent
      .put("/me/profile/email")
      .send({ email: "newemail@gmail.com", password: testUser.password });
    const log = await fs.stat(pathToLog);
    //assert
    expect(res.status).toBe(500);
    expect(res.body).toBe("Oops, server error((");
    expect(log.size).toBeGreaterThan(logdata.size);
    expect(+log.mtime).toBeGreaterThan(+logdata.mtime);
  });

  test("register err test", async () => {
    //arrange

    logdata = await fs.stat(pathToLog);

    //act
    const res = await agent.post("/auth/register").send(testUser);
    const log = await fs.stat(pathToLog);
    //assert
    expect(res.status).toBe(500);
    expect(res.body).toBe("Oops, server error((");
    expect(log.size).toBeGreaterThan(logdata.size);
    expect(+log.mtime).toBeGreaterThan(+logdata.mtime);
  });

  test("auth err test", async () => {
    //arrange

    logdata = await fs.stat(pathToLog);

    //act
    const res = await agent.post("/auth").send(testUser);
    const log = await fs.stat(pathToLog);
    //assert
    expect(res.status).toBe(500);
    expect(res.body).toBe("Oops, server error((");
    expect(log.size).toBeGreaterThan(logdata.size);
    expect(+log.mtime).toBeGreaterThan(+logdata.mtime);
  });
});
