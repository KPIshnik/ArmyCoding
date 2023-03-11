const request = require("supertest");
const superagent = require("superagent");
const { url, testmail } = require("../../../configs/credentials");
const clearDB = require("../../../DB/clearDB");
const serverPromise = require("../../../server");
const registerNewUser = require("../../../models/registerNewUser");

jest.mock("bcrypt", () => {
  const originalBcript = jest.requireActual("bcrypt");
  return {
    ...originalBcript,
    compare: (pass1, pass2) => {
      return pass1 === pass2;
    },
  };
});

jest.setTimeout(30000);

let server;
let agent;

describe("/todolists", () => {
  date = new Date();

  const testUser = {
    username: "testuser",
    password: "123",
    email: "a2f9p.testuser@inbox.testmail.app",
  };

  const testUser2 = {
    username: "testuser2",
    password: "1232",
    email: "a2f9p.testuser2@inbox.testmail.app",
  };

  const testUser3 = {
    username: "testuser3",
    password: "1233",
    email: "a2f9p.testuser3@inbox.testmail.app",
  };

  const testUser4 = {
    username: "testuser4",
    password: "1234",
    email: "a2f9p.testuser4@inbox.testmail.app",
  };

  const testUsers = [testUser, testUser2, testUser3, testUser4];
  beforeAll(async () => {
    server = await serverPromise;
    agent = request.agent(url);
    for (user of testUsers)
      await registerNewUser(
        user.email,
        user.username,
        user.password,
        null,
        null,
        "email"
      );
  });

  afterAll(async () => {
    await clearDB();
    await server.teardown();
  });

  describe("tests with user not authirized", () => {
    describe("get request", () => {
      test("should response with 200 status and 'register page' msg", async () => {
        //act
        const response = await agent.get("/todolists/share/someid").redirects();

        //assert
        expect(response.status).toBe(200);
        expect(response.body).toBe("register page");
      });
    });

    describe("post request", () => {
      test("should responce with 401 status and 'not authorized' msg", async () => {
        //act
        const responce = await agent.post("/todolists/share/").send("fakedata");

        //assert
        expect(responce.status).toBe(401);
        expect(responce.body).toBe("not authorized");
      });
    });

    test("PUT request, responce with 401 status and 'not authorized' msg", async () => {
      //arrange
      //act
      const res = await agent.put(`/todolists/share`).send("fakedata");
      //assert
      expect(res.status).toBe(401);
      expect(res.body).toBe("not authorized");
    });

    test("DELETE request, responce with 401 status and 'not authorized' msg", async () => {
      //arrange
      //act
      const res = await agent.delete(`/todolists/share/someid"`);
      //assert
      expect(res.status).toBe(401);
      expect(res.body).toBe("not authorized");
    });
  });

  describe("tests for authorized user", () => {
    const todolist = {
      listname: "test list",
      todos: [
        {
          text: "hlo",
          done: false,
          priority: 6,
        },
        {
          text: "Aloha",
          done: false,
          priority: 2,
        },
        {
          text: "hi",
          done: false,
          priority: 3,
        },
        {
          text: "x",
          done: true,
          priority: 8,
        },
        {
          text: "vas",
          done: false,
          priority: 11,
        },
        {
          text: "taras",
          done: false,
          priority: 9,
        },
      ],
    };

    const todolist2 = {
      listname: "test list2",
      todos: [
        {
          text: "text2",
          done: false,
          priority: 1,
        },
        {
          text: "Aloha2",
          done: false,
          priority: 2,
        },
        {
          text: "hi2",
          done: false,
          priority: 3,
        },
      ],
    };

    const todolist3 = {
      listname: "test list3",
      todos: [
        {
          text: "text3",
          done: false,
          priority: 1,
        },
        {
          text: "Aloha3",
          done: true,
          priority: 2,
        },
        {
          text: "hi3",
          done: false,
          priority: 4,
        },
      ],
    };
    const todolistsArr = [todolist, todolist2, todolist3];
    beforeAll(async () => {
      await agent
        .post(`/auth`)
        .send({ email: testUser.email, password: testUser.password });

      for (list of todolistsArr) {
        const res = await agent.post("/todolists").send(list);
        list.id = res.body.data.id;
      }
    });

    test(`POST request should share todolist response with code 200,
      msg(todonote created) `, async () => {
      //arrange
      const listid = todolist.id;
      const sharedUsersarr = [testUser2, testUser4];
      const usersEmailArr = [testUser2.email, testUser4.email];
      //act
      const res = await agent
        .post("/todolists/share")
        .send({ listid, usersEmailArr });
      const getRes = await agent.get(`/todolists/share/${listid}`);

      const recivedEmails = [];
      for (user of sharedUsersarr) {
        const testmailResponse = await superagent.get(
          `https://api.testmail.app/api/json?apikey=${
            testmail.api_key
          }&namespace=${testmail.namespace}&tag=${
            user.username
          }&timestamp_from=${Date.now()}&livequery=true`
        );
        recivedEmails.push(testmailResponse.body.emails[0]);
      }

      //assert
      expect(res.status).toBe(200);
      expect(res.body).toBe(`list ${listid} shared `);

      expect(getRes.status).toBe(200);
      expect(getRes.body.length).toBe(usersEmailArr.length);

      getRes.body.forEach((user, i) => {
        expect(user).toEqual({
          email: sharedUsersarr[i].email,
          username: sharedUsersarr[i].username,
          id: expect.anything(),
        });
      });

      expect(recivedEmails.length).toBe(sharedUsersarr.length);
      recivedEmails.forEach((email) => {
        expect(email.subject).toBe("todolists app. New access granted");
        expect(email.text).toBe(
          `user ${testUser.username} shred "${todolist.listname}" todolist with you`
        );
      });
    });

    //     describe("feilure tests", () => {
    //       test("0", () => {});
    //     });
  });
});

//ERROR HANDLE!!
