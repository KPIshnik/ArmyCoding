const request = require("supertest");
const { url } = require("../../../configs/credentials");
const clearDB = require("../../../DB/clearDB");
const serverPromise = require("../../../server");
const registerNewUser = require("../../../models/registerNewUser");
const getRefreshToken = require("../../../models/auth/getRefreshToken");
const jwt = require("jsonwebtoken");

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

describe("authentication unit tests", () => {
  const testUser = {
    username: "testuser",
    password: "123",
    email: "testuser@test.app",
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
  });

  afterAll(async () => {
    await clearDB();
    await server.teardown();
  });

  test("login, should responce 404 on wrong email", async () => {
    const res = await agent
      .post("/auth")
      .send({ email: "bademail@mail.com", password: testUser.password });
    //assert
    expect(res.status).toBe(404);
  });

  test("login, should responce 403 on wrong pass", async () => {
    const res = await agent
      .post("/auth")
      .send({ email: testUser.email, password: "bad" });
    //assert
    expect(res.status).toBe(400);
  });

  test("login, should responce with token and refresh token", async () => {
    //act
    const res = await agent
      .post("/auth")
      .send({ email: testUser.email, password: testUser.password });

    tokens.firstDevice = { ...res.body };

    const alohaRes = await agent
      .get("/")
      .set("Authorization", `Bearer ${tokens.firstDevice.token}`);

    //assert
    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe("string");
    expect(typeof res.body.refreshtoken).toBe("string");
    expect(alohaRes.status).toBe(200);
    expect(alohaRes.body).toBe(`Aloha ${testUser.username}!`);
  });

  test("login, multiple login, should responce with token and refresh token", async () => {
    //act
    const res2 = await agent
      .post("/auth")
      .send({ email: testUser.email, password: testUser.password });

    const res3 = await agent
      .post("/auth")
      .send({ email: testUser.email, password: testUser.password });

    tokens.secondDefice = { ...res2.body };
    tokens.thirdDevice = { ...res3.body };

    const alohaRes = await agent
      .get("/")
      .set("Authorization", `Bearer ${res2.body.token}`);

    //assert
    expect(res2.status).toBe(200);
    expect(typeof res2.body.token).toBe("string");
    expect(typeof res2.body.refreshtoken).toBe("string");
    expect(alohaRes.status).toBe(200);
  });

  test("refresh, should refresh token and delete old one", async () => {
    //act

    const refreshRes = await agent
      .post("/auth/refresh")
      .send({ ...tokens.firstDevice });

    tokens.firstDeviceNew = { ...refreshRes.body };

    const alohaRes = await agent
      .get("/")
      .set("Authorization", `Bearer ${refreshRes.body.token}`);

    //assert
    expect(refreshRes.status).toBe(200);
    expect(typeof refreshRes.body.token).toBe("string");
    expect(typeof refreshRes.body.refreshtoken).toBe("string");
    expect(alohaRes.status).toBe(200);
    expect(alohaRes.body).toBe(`Aloha ${testUser.username}!`);
  });

  test("refresh, should NOT refresh token, and delete deviceid", async () => {
    //act
    const res = await agent
      .post("/auth/refresh")
      .send({ ...tokens.firstDevice });

    const res2 = await agent
      .post("/auth/refresh")
      .send({ ...tokens.firstDeviceNew });

    //assert
    expect(res.status).toBe(400);
    expect(res2.status).toBe(404);
  });

  test("logout , should kill  device id and refreshtoken", async () => {
    const res = await agent
      .delete("/auth")
      .set("Authorization", `Bearer ${tokens.secondDefice.token}`);

    const refreshRes = await agent
      .post("/auth/refresh")
      .send({ ...tokens.secondDefice });

    //assert
    expect(res.status).toBe(200);
    expect(refreshRes.status).toBe(404);
  });

  test("totalLogout , should kill ALL refresh tokens", async () => {
    const res = await agent
      .delete("/auth/total")
      .set("Authorization", `Bearer ${tokens.secondDefice.token}`);

    const refreshRes = await agent
      .post("/auth/refresh")
      .send({ ...tokens.thirdDevice });

    //assert
    expect(res.status).toBe(200);
    expect(refreshRes.status).toBe(404);
  });
});
