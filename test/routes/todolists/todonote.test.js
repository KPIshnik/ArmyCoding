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

jest.setTimeout(30000);

let server;
let agent;

describe("/todolists", () => {
  date = new Date();

  const testUser = {
    userName: "testuser",
    password: "123",
    email: "testuser@test.app",
  };

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

  beforeAll(async () => {
    server = await serverPromise;
    agent = request.agent(url);
    await registerNewUser(
      testUser.email,
      testUser.userName,
      testUser.password,
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
        const response = await agent.get("/todonote/someid").redirects();

        //assert
        expect(response.status).toBe(200);
        expect(response.body).toBe("register page");
      });
    });

    describe("post request", () => {
      test("should responce with 401 status and 'not authorized' msg", async () => {
        //act
        const responce = await agent.post("/todonote").send(todolist.todos[0]);

        //assert
        expect(responce.status).toBe(401);
        expect(responce.body).toBe("not authorized");
      });
    });

    test("DELETE request, responce with 401 status and 'not authorized' msg", async () => {
      //arrange
      //act
      const res = await agent.delete(`/todonote/someid"`);
      //assert
      expect(res.status).toBe(401);
      expect(res.body).toBe("not authorized");
    });
  });

  describe("tests for authorized user", () => {
    const todonote = {
      listid: "",
      text: "test note",
      priority: 2,
      done: false,
    };

    beforeAll(async () => {
      await agent
        .post(`/auth`)
        .send({ email: testUser.email, password: testUser.password });
      const res = await agent.post("/todolists").send(todolist);

      todonote.listid = res.body.data.id;
    });

    test(`POST request should create todonote response with code 200, 
  msg(todonote created) `, async () => {
      //act
      const res = await agent.post("/todonote").send(todonote);
      const id = res.body.id;
      const getRes = await agent.get(`/todonote/${id}`);

      //assert
      expect(res.status).toBe(200);
      expect(res.body.msg).toBe("todonote created");

      expect(getRes.status).toBe(200);
      expect(getRes.body).toEqual({
        ...todonote,
        id,
      });
    });
  });
});

//ERROR HANDLE!!
