const request = require("supertest");
const { url, testmail } = require("../../configs/credentials");
const clearDB = require("../../DB/clearDB");
const generateKey = require("../../helpers/generateKey");
const getEmailConfirmDataById = require("../../models/getEmailConfirmDataById");
const getUserByUserName = require("../../models/getUserByUsename");
const serverPromise = require("../../server");
const superagent = require("superagent");

jest.setTimeout(60000);

jest.mock("../../helpers/generateKey");
jest.mock("bcrypt", () => {
  const originalBcript = jest.requireActual("bcrypt");
  return {
    ...originalBcript,
    hash: (pass) => {
      return `hashed ${pass}`;
    },
  };
});

const RealDate = Date.now;

let server;

describe("e2e testing register user", () => {
  beforeAll(async () => {
    server = await serverPromise;
    generateKey.mockImplementation(() => "key");
    global.Date.now = jest.fn(() => new Date("2019-04-07T10:20:30Z").getTime());
  });

  afterAll(async () => {
    await clearDB();
    await server.teardown();
    global.Date.now = RealDate;
  });

  test(`should return code: 200, msg: "register page"
      on get request when not authorithed`, async () => {
    const response = await request(server).get("/auth/register");

    expect(response.status).toBe(200);
    expect(response.body).toBe("register page");
  });

  test(`should register user with correct data on post request,
        send confirm email and
        return code: 200,
        msg: "user username registered, please confirm email"`, async () => {
    const testUser = {
      userName: "testuser",
      password: "123",
      password2: "123",
      email: "a2f9p.testuser@inbox.testmail.app",
    };

    //act
    const response = await request(server)
      .post("/auth/register")
      .send(testUser);

    const testmailResponse = await superagent.get(
      `https://api.testmail.app/api/json?apikey=${testmail.api_key}&namespace=${
        testmail.namespace
      }&tag=${testUser.userName}&timestamp_from=${Date.now()}&livequery=true`
    );

    const user = await getUserByUserName(testUser.userName);
    const emailConfirmData = await getEmailConfirmDataById(user.id);

    //asssert

    expect(response.status).toBe(200);
    expect(response.body).toBe(
      `user ${testUser.userName} registered, please confirm email`
    );

    expect(user).toEqual({
      id: expect.anything(),
      username: testUser.userName,
      email: null,
      password: `hashed ${testUser.password}`,
      googleid: null,
      facebookid: null,
      auth_type: "email",
    });

    expect(testmailResponse.body.emails[0].subject).toBe("Confirm email");
    expect(testmailResponse.body.emails[0].text).toBe(
      `${url}/auth/confirmEmail?key=key`
    );

    expect(emailConfirmData).toEqual({
      id: user.id,
      email: testUser.email,
      key: "key",
      date: Date.now().toString(),
    });
  });
});
