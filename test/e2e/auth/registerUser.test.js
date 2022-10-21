//Не протестирована отправка мыла!!!
//две проблемы:
//  -Джест не умеет в паралельные потоки
//  -Не нашел тет апи у Сенд Грида

/// проверять через эндпоинты

//!!!this is route test not e2e!!

const request = require("supertest");
const { url } = require("../../../configs/credentials");
const clearDB = require("../../../DB/clearDB");
const sendEmailThred = require("../../../helpers/sendMailThred");
const getEmailConfirmDataById = require("../../../models/getEmailConfirmDataById");
const getUserByUserName = require("../../../models/getUserByUsename");
const serverPromise = require("../../../server");

jest.mock("../../../helpers/sendMailThred");
jest.mock("bcrypt", () => {
  const originalBcript = jest.requireActual("bcrypt");
  return {
    ...originalBcript,
    hash: (pass) => {
      return `hashed ${pass}`;
    },
  };
});

let server;

describe("e2e testing register user", () => {
  beforeAll(async () => {
    server = await serverPromise;
  });

  afterAll(async () => {
    await clearDB();
    await server.teardown();
  });

  test(`should return code: 200, msg: "register page"
      on get request when not authorithed`, async () => {
    const response = await request(server).get("/auth/register");

    expect(response.status).toBe(200);
    expect(response.body).toBe("register page");
  });

  test(`should , msg: "register page"
      on get request when not authorithed`, async () => {
    const response = await request(server).get("/auth/register");

    expect(response.status).toBe(200);
    expect(response.body).toBe("register page");
  });

  test(`should register user with correct data,
        send confirm email and
        return code: 200,
        msg: "user username registered, please confirm email"`, async () => {
    const testUser = {
      userName: "Test user",
      password: "123",
      password2: "123",
      email: "antaresstat@gmail.com",
    };

    //act
    const response = await request(server)
      .post("/auth/register")
      .send(testUser);

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

    const subject = "Confirm email";
    const content = `${url}/auth/confirmEmail?key=${emailConfirmData.key}`;

    //
    expect(sendEmailThred).toHaveBeenCalledTimes(1);
    expect(sendEmailThred).toHaveBeenCalledWith(
      testUser.email,
      subject,
      content
    );
  });
});
