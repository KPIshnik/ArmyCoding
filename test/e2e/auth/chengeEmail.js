const request = require("supertest");
const { url, testmail } = require("../../../configs/credentials");
const clearDB = require("../../../DB/clearDB");
const serverPromise = require("../../../server");
const superagent = require("superagent");

jest.setTimeout(20000);

let server;

describe("e2e testing chenging email", () => {
  beforeAll(async () => {
    server = await serverPromise;
  });

  afterAll(async () => {
    await clearDB();
    await server.teardown();
  });

  test(`should register user with correct data, then chage  email,
  response with code: 200, json: "confirm new email"`, async () => {
    //arrange
    const testUser = {
      userName: "testuser",
      password: "123",
      password2: "123",
      email: "a2f9p.testuser@inbox.testmail.app",
    };

    const newEmail = "a2f9p.newEmail@inbox.testmail.app";
    //act

    await request(url).post("/auth/register").send(testUser);

    const testmailResponse = await superagent.get(
      `https://api.testmail.app/api/json?apikey=${testmail.api_key}&namespace=${
        testmail.namespace
      }&tag=testuser&timestamp_from=${Date.now()}&livequery=true`
    );

    const lastRecivedEmail = testmailResponse.body.emails[0];
    const confirmEmailURL = `${lastRecivedEmail.text}`;

    const confirmEmailResponse = await request(confirmEmailURL).get("");

    const agent = request.agent(url);

    await agent(url)
      .post(`/auth`)
      .send({ email: testUser.email, password: testUser.password });

    await agent(url)
      .post(`/auth`)
      .send({ email: newEmail, password: testUser.password });
    // asssert;

    expect(registerResponse.status).toBe(200);
    expect(registerResponse.body).toBe(
      `user ${testUser.userName} registered, please confirm email`
    );

    expect(lastRecivedEmail.subject).toBe("Confirm email");

    expect(confirmEmailResponse.status).toBe(200);
    expect(confirmEmailResponse.body).toBe("Email confirmed");

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toBe(`Aloha ${testUser.userName}!`);
  });
});
