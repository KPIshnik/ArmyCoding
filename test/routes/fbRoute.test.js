// const request = require("supertest");
// const { url, testmail } = require("../../configs/credentials");
// const clearDB = require("../../DB/clearDB");
// const serverPromise = require("../../server");
// const clearDbTables = require("../../DB/clearDbTables");
// const registerNewUser = require("../../models/registerNewUser");
// const createEmailConfirmRow = require("../../models/createEmailConfirmRow");
// const getUserById = require("../../models/getUserrById");
// const { confirmEmailExpireTime } = require("../../configs/settings");

jest.setTimeout(60000);

let server;

describe("/auth/fb ", () => {
  test("", () => {});
  //   beforeAll(async () => {
  //     server = await serverPromise;
  //   });

  //   beforeEach(async () => {
  //     await clearDbTables();
  //   });

  //   afterAll(async () => {
  //     await clearDB();
  //     await server.teardown();
  //   });

  //   test(`success`, async () => {
  //     //arrandge
  //     const response = await request.agent(`${url}/auth/fb`).get("");

  //     //act

  //     const user = await getUserById(id);
  //     //assert
  //     expect(response.status).toBe(200);
  //     expect(response.body).toBe("Email confirmed");

  //     expect(user.email).toBe(userData.email);
  //   });

  //   test('should return code: 400, msg: "valid key required" when no key', async () => {
  //     const response = await request
  //       .agent(`${url}/auth/confirmEmail?data=data`)
  //       .get("");

  //     expect(response.status).toBe(400);
  //     expect(response.body).toBe("valid key required");
  //   });

  //   test('should return code: 400, msg: "confirm key not valid or expired" when no key in DB', async () => {
  //     const response = await request
  //       .agent(`${url}/auth/confirmEmail?key=nokey`)
  //       .get("");

  //     expect(response.status).toBe(400);
  //     expect(response.body).toBe("confirm key not valid or expired");
  //   });

  //   test('should return code: 400, msg: "confirm key expired" when key expired', async () => {
  //     //arrange

  //     const userData = {
  //       email: "testmail@test.app",
  //       date: Date.now(),
  //       key: "key",
  //       userName: "testuser",
  //       password: "pass",
  //     };

  //     const id = await registerNewUser(
  //       userData.email,
  //       userData.userName,
  //       userData.password,
  //       null,
  //       null,
  //       "email"
  //     );

  //     await createEmailConfirmRow(
  //       id,
  //       userData.key,
  //       userData.email,
  //       userData.date
  //     );
  //     //act
  //     jest.advanceTimersByTime(confirmEmailExpireTime + 1);
  //     const response = await request
  //       .agent(`${url}/auth/confirmEmail?key=${userData.key}`)
  //       .get("");

  //     //assert
  //     expect(response.status).toBe(400);
  //     expect(response.body).toBe("confirm key expired");
  //   });
});
