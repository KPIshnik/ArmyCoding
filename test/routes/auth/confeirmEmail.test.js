const request = require("supertest");
const { url } = require("../../../configs/config");
const clearDB = require("../../../DB/clearDB");
const serverPromise = require("../../../server");
const clearDbTables = require("../../../DB/clearDbTables");
const registerNewUser = require("../../../models/registerNewUser");
const createEmailConfirmRow = require("../../../models/createEmailConfirmRow");
const getUserById = require("../../../models/getUserrById");
const { confirmEmailExpireTime } = require("../../../configs/settings");

jest.setTimeout(60000);

let server;

describe("/auth/confirmemail ", () => {
  beforeAll(async () => {
    server = await serverPromise;
    jest.useFakeTimers({ advanceTimers: true });
  });

  beforeEach(async () => {
    await clearDbTables();
  });

  afterAll(async () => {
    await clearDB();
    await server.teardown();
    jest.useRealTimers();
  });

  test(`should return code: 200, msg: "Email confirmed"
        on get request when key is valid`, async () => {
    //arrandge
    const userData = {
      email: "testmail@test.app",
      date: Date.now(),
      key: "key",
      username: "testuser",
      password: "pass",
    };

    const id = await registerNewUser(
      userData.email,
      userData.username,
      userData.password,
      null,
      null,
      "email"
    );

    await createEmailConfirmRow(
      id,
      userData.key,
      userData.email,
      userData.date
    );

    //act
    const response = await request
      .agent(`${url}/auth/confirmEmail?key=${userData.key}`)
      .get("");

    const user = await getUserById(id);
    //assert
    expect(response.status).toBe(200);

    expect(user.email).toBe(userData.email);
  });

  test('should return code: 400, msg: "valid key required" when no key', async () => {
    const response = await request
      .agent(`${url}/auth/confirmEmail?data=data`)
      .get("");

    expect(response.status).toBe(400);
    expect(response.body).toBe("valid key required");
  });

  test('should return code: 400, msg: "confirm key not valid or expired" when no key in DB', async () => {
    const response = await request
      .agent(`${url}/auth/confirmEmail?key=nokey`)
      .get("");

    expect(response.status).toBe(400);
    expect(response.body).toBe("confirm key not valid or expired");
  });

  test('should return code: 400, msg: "confirm key expired" when key expired', async () => {
    //arrange

    const userData = {
      email: "testmail@test.app",
      date: Date.now(),
      key: "key",
      username: "testuser",
      password: "pass",
    };

    const id = await registerNewUser(
      userData.email,
      userData.username,
      userData.password,
      null,
      null,
      "email"
    );

    await createEmailConfirmRow(
      id,
      userData.key,
      userData.email,
      userData.date
    );
    //act
    jest.advanceTimersByTime(confirmEmailExpireTime + 1);
    const response = await request
      .agent(`${url}/auth/confirmEmail?key=${userData.key}`)
      .get("");

    //assert
    expect(response.status).toBe(400);
    expect(response.body).toBe("confirm key expired");
  });
});
