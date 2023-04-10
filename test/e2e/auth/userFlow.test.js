const request = require("supertest");
const { url, testmail } = require("../../../configs/credentials");
const clearDB = require("../../../DB/clearDB");
const serverPromise = require("../../../server");
const superagent = require("superagent");

jest.setTimeout(60000);

let server;

describe("user register via email and chenging userdata", () => {
  const testUser = {
    username: "testuser",
    password: "123",
    password2: "123",
    email: "a2f9p.testuser@inbox.testmail.app",

    newUsername: "testuser_new",
    newEmail: "a2f9p.testuser_new@inbox.testmail.app",
    newPassword: "321",
  };

  beforeAll(async () => {
    server = await serverPromise;
    agent = request.agent(url);
  });

  afterAll(async () => {
    await clearDB();
    await server.teardown();
  });

  describe("register user flow", () => {
    let confirmEmailURL;
    let date;
    describe("succes", () => {
      test(`should register user with correct data,
          return code: 200,
          msg: "user testuser registered, please confirm email"`, async () => {
        //arrange
        date = Date.now();
        //act

        const registerResponse = await agent
          .post("/auth/register")
          .send(testUser);

        expect(registerResponse.status).toBe(200);
        expect(registerResponse.body).toBe(
          `user ${testUser.username} registered, please confirm email`
        );
      });

      test(`should recive confirm email ,
          recived email subject should be: "Confirm email"`, async () => {
        //act

        const testmailResponse = await superagent.get(
          `https://api.testmail.app/api/json?apikey=${testmail.api_key}&namespace=${testmail.namespace}&tag=${testUser.username}&timestamp_from=${date}&livequery=true`
        );

        const lastRecivedEmail = testmailResponse.body.emails[0];
        confirmEmailURL = `${lastRecivedEmail.text}`;

        //assert
        expect(lastRecivedEmail.subject).toBe("Confirm email");
      });

      test(`should confirm email via recived.
          return code: 200,
          msg: "Email confirmed"`, async () => {
        //act
        const confirmEmailResponse = await request(confirmEmailURL).get("");

        // asssert;

        expect(confirmEmailResponse.status).toBe(200);
        expect(confirmEmailResponse.body).toBe("Email confirmed");
      });

      test(`should login via user data,
          return code: 200,
          msg: "user testuser registered, please confirm email"`, async () => {
        //act
        const loginResponse = await agent
          .post(`/auth`)
          .send({ email: testUser.email, password: testUser.password })
          .redirects();
        //assert
        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body).toBe(`Aloha ${testUser.username}!`);
      });
    });
  });

  describe("chenging username", () => {
    test("should seccesfuly change logged in user's username", async () => {
      const response = await agent
        .post(`/me/profile/username`)
        .send({ username: testUser.newUsername, password: testUser.password });

      expect(response.status).toBe(200);
      expect(response.body).toBe("username changed");
    });
  });

  describe("chenging email", () => {
    let confirmEmailURL;
    let date;

    test("should seccesfuly change logged in user's email", async () => {
      date = Date.now();

      const response = await agent
        .post(`/me/profile/email`)
        .send({ email: testUser.newEmail, password: testUser.password });

      expect(response.status).toBe(200);
      expect(response.body).toBe("confirm new email");
    });

    test(`should recive confirm email ,
    recived email subject should be: "Confirm email"`, async () => {
      //act

      const response = await superagent.get(
        `https://api.testmail.app/api/json?apikey=${testmail.api_key}&namespace=${testmail.namespace}&tag=${testUser.newUsername}&timestamp_from=${date}&livequery=true`
      );

      const lastRecivedEmail = response.body.emails[0];
      confirmEmailURL = `${lastRecivedEmail.text}`;

      //assert
      expect(lastRecivedEmail.subject).toBe("Confirm email");
    });

    test(`should confirm email via recived url.
    return code: 200,
    msg: "Email confirmed"`, async () => {
      //act
      const response = await request(confirmEmailURL).get("");

      // asssert;

      expect(response.status).toBe(200);
      expect(response.body).toBe("Email confirmed");
    });

    test(`should login via new Email,
    return code: 200,
    msg: "user testuser registered, please confirm email"`, async () => {
      //act
      const response = await agent
        .post(`/auth`)
        .send({ email: testUser.newEmail, password: testUser.password })
        .redirects();
      //assert
      expect(response.status).toBe(200);
      expect(response.body).toBe(`Aloha ${testUser.newUsername}!`);
    });
  });

  describe("chenging password", () => {
    test("should seccesfuly change logged in user's username", async () => {
      const response = await agent.post(`/me/profile/password`).send({
        password: testUser.password,
        newPass: testUser.newPassword,
        newPass2: testUser.newPassword,
      });

      expect(response.status).toBe(200);
      expect(response.body).toBe("password chenged");
    });
  });
});
