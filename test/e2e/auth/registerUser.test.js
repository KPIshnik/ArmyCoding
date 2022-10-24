//Не протестирована отправка мыла!!!
//две проблемы:
//  -Джест не умеет в паралельные потоки
//  -Не нашел тет апи у Сенд Грида

/// проверять через эндпоинты

//!!!this is route test not e2e!!

const request = require("supertest");
const { url, testmail } = require("../../../configs/credentials");
const clearDB = require("../../../DB/clearDB");
const serverPromise = require("../../../server");
const superagent = require("superagent");

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

  test(`should register user with correct data,
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

    const res = await superagent.get(
      `https://api.testmail.app/api/json?apikey=${testmail.api_key}&namespace=${testmail.namespace}&tag=testuser`
    );

    const lastRecivedEmail = res.body.emails[0];

    //asssert

    expect(response.status).toBe(200);
    expect(response.body).toBe(
      `user ${testUser.userName} registered, please confirm email`
    );
    expect(lastRecivedEmail.subject).toBe("Confirm email");
  });
});
