const request = require("supertest");
const { url } = require("../../../configs/credentials");
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

jest.setTimeout(300000);

let server;
let agent;

describe("/todolists", () => {
  date = new Date();

  const testUser = {
    userName: "testuser",
    password: "123",
    email: "testuser@test.app",
  };

  const testUser2 = {
    userName: "testuser2",
    password: "1232",
    email: "testuser2@test.app",
  };

  const testUser3 = {
    userName: "testuser3",
    password: "1233",
    email: "testuser3@test.app",
  };

  const testUser4 = {
    userName: "testuser4",
    password: "1234",
    email: "testuser4@test.app",
  };

  const testUsers = [testUser, testUser2, testUser3, testUser4];
  beforeAll(async () => {
    server = await serverPromise;
    agent = request.agent(url);
    for (user of testUsers)
      await registerNewUser(
        user.email,
        user.userName,
        user.password,
        null,
        null,
        "email"
      );
    jest
      .useFakeTimers({
        doNotFake: [
          "nextTick",
          "queueMicrotask",
          "hrtime",
          "performance",
          "requestAnimationFrame",
          "cancelAnimationFrame",
          "requestIdleCallback",
          "cancelIdleCallback",
          "setImmediate",
          "clearImmediate",
          "setInterval",
          "clearInterval",
          "setTimeout",
          "clearTimeout",
        ],
      })
      .setSystemTime(date);
  });

  afterAll(async () => {
    await clearDB();
    await server.teardown();
    jest.useRealTimers();
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

      //assert
      expect(res.status).toBe(200);
      expect(res.body).toBe(`list ${listid} shared `);

      expect(getRes.status).toBe(200);
      expect(getRes.body.length).toBe(usersEmailArr.length);
      getRes.body.forEach((user, i) => {
        expect(user).toEqual({
          email: sharedUsersarr[i].email,
          userName: sharedUsersarr[i].userName,
          id: expect.anything(),
        });
      });
    });

    //     describe("feilure tests", () => {
    //       test("0", () => {});
    //     });
  });
});

//ERROR HANDLE!!
