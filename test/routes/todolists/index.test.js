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

  const todolist = {
    listname: "test list",
    todos: [
      {
        text: "halo",
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
        const response = await agent.get("/todolists").redirects();

        //assert
        expect(response.status).toBe(200);
        expect(response.body).toBe("register page");
      });
    });

    describe("post request", () => {
      test("should responce with 401 status and 'not authorized' msg", async () => {
        //act
        const responce = await agent.post("/todolists").send(todolist);

        //assert
        expect(responce.status).toBe(401);
        expect(responce.body).toBe("not authorized");
      });
    });

    test("DELETE request, responce with 401 status and 'not authorized' msg", async () => {
      //arrange
      //act
      const res = await agent.delete(`/todolists?id=${todolist.id}`);
      //assert
      expect(res.status).toBe(401);
      expect(res.body).toBe("not authorized");
    });
  });

  describe("tests for authorized user", () => {
    beforeAll(async () => {
      await agent
        .post(`/auth`)
        .send({ email: testUser.email, password: testUser.password });
    });

    test(`create and get singl todolist,
            and response with 200 code and "todolist listname created" and return todolist with todos msg`, async () => {
      //act

      const response = await agent.post("/todolists").send(todolist);

      todolist.id = response.body.data ? response.body.data.id : undefined;
      const getResp = await agent.get(`/todolists?id=${todolist.id}`);

      //assert
      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        `todolist ${todolist.listname} created`
      );

      expect(getResp.status).toBe(200);
      expect(getResp.body.listData.listname).toBe(todolist.listname);
      expect(getResp.body.listData.updated_at).toBe(date.toJSON());

      const sortedTodos = [...todolist.todos].sort(
        (todo1, todo2) => todo1.priority - todo2.priority
      );

      getResp.body.todos.forEach((todo, i) => {
        expect(todo).toEqual({
          id: expect.anything(),
          list_id: response.body.data.id,
          text: sortedTodos[i].text,
          done: sortedTodos[i].done,
          priority: i + 1,
          rank: expect.anything(),
        });
      });
    });

    test(`create and get miltiple todolists,
            and response with 200 code and return todolists `, async () => {
      //arrange
      const todolist2 = {
        listname: "list2",
      };
      const todolist3 = {
        listname: "list3",
        todos: [
          {
            text: "qweaSD",
            done: true,
            priority: 6,
          },
          {
            text: "Aloha",
            done: false,
            priority: 4,
          },
          {
            text: "65234",
            done: false,
            priority: 3,
          },
        ],
      };
      const todolist4 = {
        listname: "list4",
      };

      const userTodolistsArr = [todolist, todolist2, todolist3, todolist4];
      userTodolistsArr.sort((l1, l2) => (l1.listname < l2.listname ? -1 : 1));

      //act

      // !!FIX when testing delete todolist
      // const resp = await agent.post("/todolists").send(todolist);
      await agent.post("/todolists").send(todolist2);
      await agent.post("/todolists").send(todolist3);
      await agent.post("/todolists").send(todolist4);

      const getResp = await agent.get(`/todolists`);

      const userTodoLists = getResp.body;

      //assert

      expect(getResp.status).toBe(200);

      userTodoLists.forEach((todolist, i) => {
        expect(todolist).toEqual({
          listname: userTodolistsArr[i].listname,
          id: expect.anything(),
          updated_at: date.toJSON(),
          owner_id: expect.anything(),
        });
      });
    });

    test("DELETE request, should delete todolist, response with 200 code", async () => {
      //arrange
      //act
      const res = await agent.delete(`/todolists?id=${todolist.id}`);
      const getRes = await agent.get(`/todolists?id=${todolist.id}`);
      //assert
      expect(res.status).toBe(200);
      expect(res.body).toBe(`todolist ${todolist.listname} deleted`);
      expect(getRes.status).toBe(404);
    });

    test(`POST request, should NOT create todolist with no listname,
     response with 400 code and "listname required" msg`, async () => {
      //arrange
      const todolistWithNoListname = {
        listnam: "listname",
      };

      //act
      const response = await agent
        .post("/todolists")
        .send(todolistWithNoListname);

      //assert
      expect(response.status).toBe(400);
      expect(response.body).toBe("listname required");
    });

    test(`POST request, should NOT create todolist,
     with todos with same priority   `, async () => {
      //arrange
      const todolistWithBrokenPriority = {
        listname: "listname",
        todos: [
          {
            text: "do",
            priority: 1,
            done: false,
          },
          {
            text: "dodo",
            priority: 1,
            done: false,
          },
        ],
      };

      //act
      const response = await agent
        .post("/todolists")
        .send(todolistWithBrokenPriority);

      //assert
      expect(response.status).toBe(400);
      expect(response.body).toBe("request not valid");
    });

    test(`POST request, should NOT create todolist,
     with todos with wrong done type  `, async () => {
      //arrange
      const todolistWithDoneType = {
        listname: "listname",
        todos: [
          {
            text: "do",
            priority: 1,
            done: false,
          },
          {
            text: "dodo",
            priority: 2,
            done: 4,
          },
        ],
      };

      //act
      const response = await agent
        .post("/todolists")
        .send(todolistWithDoneType);

      //assert
      expect(response.status).toBe(400);
      expect(response.body).toBe("request not valid");
    });

    test(`POST request, should NOT create todolist,
     with no text in todo`, async () => {
      //arrange
      const todolistWithNoText = {
        listname: "listname",
        todos: [
          {
            text: "do",
            priority: 1,
            done: false,
          },
          {
            priority: 2,
            done: false,
          },
        ],
      };

      //act
      const response = await agent.post("/todolists").send(todolistWithNoText);

      //assert
      expect(response.status).toBe(400);
      expect(response.body).toBe("request not valid");
    });

    test(`POST request, should NOT create todolist,
    with todos wrong same priority type`, async () => {
      //arrange
      const todolistWithBrokenPriority = {
        listname: "listname",
        todos: [
          {
            text: "do",
            priority: 1,
            done: false,
          },
          {
            text: "dodo",
            priority: "x",
            done: false,
          },
        ],
      };

      //act
      const response = await agent
        .post("/todolists")
        .send(todolistWithBrokenPriority);

      //assert
      expect(response.status).toBe(400);
      expect(response.body).toBe("request not valid");
    });
  });
});

//ERROR HANDLE!!
