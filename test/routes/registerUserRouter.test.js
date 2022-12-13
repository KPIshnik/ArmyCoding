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

jest.mock("../../helpers/generateKey", () => {
  return () => "key";
});

jest.mock("bcrypt", () => {
  const originalBcript = jest.requireActual("bcrypt");
  return {
    ...originalBcript,
    hash: (pass) => {
      return `hashed ${pass}`;
    },
  };
});

jest.setTimeout(60000);

let server;

describe("/auth/register ", () => {
  beforeAll(async () => {
    server = await serverPromise;
    jest.useFakeTimers({ advanceTimers: true });
    global.Date.now = jest.fn(() => new Date("2019-04-07T10:20:30Z").getTime());
  });

  beforeEach(async () => {
    await clearDbTables();
  });

  afterAll(async () => {
    await clearDB();
    await server.teardown();
    // global.Date.now = RealDate;
    jest.useRealTimers();
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

  test("should not register user with not matching pass", async () => {
    const testUser = {
      userName: "user_with_bad_pass",
      password: "123",
      password2: "12345",
      email: "a2f9p.user_with_bad_pass@inbox.testmail.app",
    };
    //act
    const response = await request(server)
      .post("/auth/register")
      .send(testUser);

    const user = await getUserByUserName(testUser.userName);
    //assert

    expect(response.status).toBe(400);
    expect(response.body).toBe("pass too short or does not match");

    expect(user).toBe(undefined);
  });

  test("should not register user with no pass", async () => {
    const testUser = {
      userName: "user_with_bad_pass",
      password: "",
      password2: "",
      email: "a2f9p.user_with_bad_pass@inbox.testmail.app",
    };
    //act
    const response = await request(server)
      .post("/auth/register")
      .send(testUser);

    const user = await getUserByUserName(testUser.userName);
    //assert

    expect(response.status).toBe(400);
    expect(response.body).toBe("pass too short or does not match");

    expect(user).toBe(undefined);
  });

  test("should not register user with empty username", async () => {
    const testUser = {
      userName: "",
      password: "123",
      password2: "123",
      email: "a2f9p.user_with_no_username@inbox.testmail.app",
    };
    //act
    const response = await request(server)
      .post("/auth/register")
      .send(testUser);

    const user = await getUserByUserName(testUser.userName);
    //assert

    expect(response.status).toBe(400);
    expect(response.body).toBe("username missing");

    expect(user).toBe(undefined);
  });

  test("should not register user with not unique username", async () => {
    const testUser = {
      userName: "testuser",
      password: "123",
      password2: "123",
      email: "a2f9p.testuser@inbox.testmail.app",
    };

    const notUniqueUser = {
      userName: "testuser",
      password: "1234",
      password2: "1234",
      email: "a2f9p.sommail@inbox.testmail.app",
    };
    //act
    await request(server).post("/auth/register").send(testUser);

    const response = await request(server)
      .post("/auth/register")
      .send(notUniqueUser);

    //assert

    expect(response.status).toBe(400);
    expect(response.body).toBe(
      "this username already registered, try another one"
    );
  });
  test("should not register user with no email", async () => {
    const testUser = {
      userName: "testuser",
      password: "123",
      password2: "123",
      email: "",
    };

    //act

    const response = await request(server)
      .post("/auth/register")
      .send(testUser);

    const user = await getUserByUserName(testUser.userName);

    //assert

    expect(response.status).toBe(400);
    expect(response.body).toBe("email missing");

    expect(user).toBe(undefined);
  });
  test("should not register user with not valid email", async () => {
    const testUser = {
      userName: "testuser",
      password: "123",
      password2: "123",
      email: "",
    };

    const emails = [
      "abc-@mail.com",
      "abc..def@mail.com",
      ".abc@mail.com",
      "abc#def@mail.com",
      "abc.def@mail.c",
      "abc.def@mail#archive.com",
      "abc.def@mail",
      "abc.def@mail..com",
      "qwe",
      "@qwe",
      "qwe@",
    ];

    for (const email of emails) {
      testUser.email = email;

      const response = await request(server)
        .post("/auth/register")
        .send(testUser);

      const user = await getUserByUserName(testUser.userName);

      expect(response.status).toBe(400);
      expect(response.body).toBe("email not valid");

      expect(user).toBe(undefined);
    }
  });

  test("should not register user with not unique email", async () => {
    const testUser = {
      userName: "testuser",
      password: "123",
      password2: "123",
      email: "a2f9p.testuser@inbox.testmail.app",
    };

    const notUniqueUser = {
      userName: "testuser2",
      password: "1234",
      password2: "1234",
      email: "a2f9p.testuser@inbox.testmail.app",
    };
    //act
    await registerNewUser(
      testUser.email,
      testUser.userName,
      "pass",
      null,
      null,
      "email"
    );

    const response = await request(server)
      .post("/auth/register")
      .send(notUniqueUser);

    //assert

    expect(response.status).toBe(400);
    expect(response.body).toBe(
      "this email already registered, try another one"
    );
  });

  test("err handling", () => {});
});
