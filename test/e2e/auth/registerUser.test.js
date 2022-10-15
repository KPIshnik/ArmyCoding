const request = require("supertest");
const app = require("../../../app");

describe("e2e testing register user", () => {
  test(`should return code: 200, msg: "register page" 
      on get request when not authorithed`, async () => {
    const response = await request(app).get("/auth/register");

    expect(response.status).toBe(200);
    expect(response.body).toBe("register page");
  });

  test(`should , msg: "register page" 
      on get request when not authorithed`, async () => {
    const response = await request(app).get("/auth/register");

    expect(response.status).toBe(200);
    expect(response.body).toBe("register page");
  });

  test(`should register user with correct data, 
        send confirm email and 
        return code: 200, 
        msg: "user username registered, please confirm email"`, async () => {
    //arrange

    const testUser = {
      userName: "Io",
      password: "123",
      password2: "123",
      email: "antaresstat@gmail.com",
    };

    //act
    const response = await request(app).post("/auth/register").send(testUser);
  });
});
