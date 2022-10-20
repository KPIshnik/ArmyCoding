const request = require("supertest");
const clearDB = require("../../../DB/clearDB");
const serverPromise = require("../../../server");

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
    // expect(5).toBe(5);
  });

  // test(`should , msg: "register page"
  //     on get request when not authorithed`, async () => {
  //   const response = await request(app).get("/auth/register");

  //   expect(response.status).toBe(200);
  //   expect(response.body).toBe("register page");
  // });

  // test(`should register user with correct data,
  //       send confirm email and
  //       return code: 200,
  //       msg: "user username registered, please confirm email"`, async () => {
  //   //arrange
  //   console.log(process.env.NODE_ENV);
  //   const testUser = {
  //     userName: "Test user",
  //     password: "123",
  //     password2: "123",
  //     email: "antaresstat@gmail.com",
  //   };

  //   //act
  //   const response = await request(app).post("/auth/register").send(testUser);

  //   //asssert
  // });
});
