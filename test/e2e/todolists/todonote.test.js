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

//jest.setTimeout(30000);

let server;
let agent;

describe("/todolists/todonotes", () => {
  date = new Date();

  const testUser = {
    username: "testuser",
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

  const todonote = {
    text: "test note",
    priority: 2,
    done: false,
  };

  let listid;
  let id;
  beforeAll(async () => {
    server = await serverPromise;
    agent = request.agent(url);
    await registerNewUser(
      testUser.email,
      testUser.username,
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
        const response = await agent
          .get("/todolists/todonotes/someid")
          .redirects();

        //assert
        expect(response.status).toBe(200);
        expect(response.body).toBe("register page");
      });
    });

    describe("post request", () => {
      test("should responce with 401 status and 'not authorized' msg", async () => {
        //act
        const responce = await agent
          .post("/todolists/someid/todonotes/")
          .send(todolist.todos[0]);

        //assert
        expect(responce.status).toBe(401);
        expect(responce.body).toBe("not authorized");
      });
    });

    test("DELETE request, responce with 401 status and 'not authorized' msg", async () => {
      //arrange
      //act
      const res = await agent.delete(`/todolists/todonotes/someid`);
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
      const res = await agent.post("/todolists").send(todolist);

      listid = res.body.data.id;
    });

    afterAll(async () => {
      const res = await agent
        .post(`/todolists/${listid}/todonotes`)
        .send(todonote);

      id = res.body.id;
      await agent.delete(`/auth`);
    });
    test(`POST request should create todonote response with code 200, 
  msg(todonote created) `, async () => {
      //act
      const res = await agent
        .post(`/todolists/${listid}/todonotes`)
        .send(todonote);

      id = res.body.id;
      const getRes = await agent.get(`/todolists/todonotes/${id}`);

      //assert
      expect(res.status).toBe(200);
      expect(res.body.msg).toBe("todonote created");

      expect(getRes.status).toBe(200);
      expect(getRes.body).toEqual({
        ...todonote,
        id,
        listid,
      });
    });

    test(`PUT request should update todonote response with code 200, 
    msg(todonote id updated) `, async () => {
      //arrange
      todonote.text = "new awesome text";
      todonote.done = true;
      todonote.priority = 5;

      //act
      const res = await agent
        .put(`/todolists/${listid}/todonotes/${id}`)
        .send(todonote);
      const getRes = await agent.get(`/todolists/todonotes/${id}`);

      //assert
      expect(res.status).toBe(200);
      expect(res.body).toBe(`todonote ${id} updated`);

      expect(getRes.status).toBe(200);
      expect(getRes.body).toEqual({
        ...todonote,
        id,
        listid,
      });
    });

    test('DELETE, should delete todonote, respose with code 200, "deleted" msg', async () => {
      //act
      const res = await agent.delete(`/todolists/todonotes/${id}`);
      const getRes = await agent.get(`/todolists/todonotes/${id}`);

      //assert
      expect(res.status).toBe(200);
      expect(res.body).toBe("deleted");
      expect(getRes.status).toBe(404);
    });

    describe("feilure tests", () => {
      test("POST should not create todonote with not valid list ID", async () => {
        //act
        const res = await agent.post(`/todolists/asdf/todonotes`).send({
          ...todonote,
        });
        //assert
        expect(res.status).toBe(400);
        expect(res.body).toBe("valid list id required");
      });

      test("POST should not create todonote with wrong done type", async () => {
        //act
        const res = await agent.post(`/todolists/${listid}/todonotes`).send({
          ...todonote,
          done: "false",
        });
        //assert
        expect(res.status).toBe(400);
        expect(res.body).toBe("done should be boolean type");
      });
      test("POST should not create todonote with wrong priority type", async () => {
        //act
        const res = await agent.post(`/todolists/${listid}/todonotes`).send({
          ...todonote,
          priority: "1",
        });
        //assert
        expect(res.status).toBe(400);
        expect(res.body).toBe("priority should be integer type");
      });
      test("POST should not create todonote without text", async () => {
        //act
        const res = await agent.post(`/todolists/${listid}/todonotes`).send({
          ...todonote,
          text: "",
        });
        //assert
        expect(res.status).toBe(400);
        expect(res.body).toBe("todo text reuired");
      });
      test("GET should not get todonote with not valid  id", async () => {
        //act
        const res = await agent.get("/todolists/todonotes/123454");
        //assert
        expect(res.status).toBe(400);
        expect(res.body).toBe("valid id required");
      });
      test("delete should not delete todonote with not valid list id", async () => {
        //act
        const res = await agent.delete("/todolists/todonotes/123454");
        //assert
        expect(res.status).toBe(400);
        expect(res.body).toBe("valid id required");
      });
      test("delete should resp with 404", async () => {
        //act
        const res = await agent.delete(
          "/todolists/todonotes/54e18a6a-be9a-11ed-afa1-0242ac120002"
        );
        //assert
        expect(res.status).toBe(404);
      });

      test("PUT should not update todonote with not valid  id", async () => {
        //act
        const res = await agent
          .put(`/todolists/${listid}/todonotes/ "not valid"`)
          .send(todonote);
        //assert
        expect(res.status).toBe(400);
        expect(res.body).toBe("valid id required");
      });

      test("PUT should not create todonote with not valid list ID", async () => {
        //act
        const res = await agent
          .put(`/todolists/notvalid/todonotes/${id}`)
          .send(todonote);
        //assert
        expect(res.status).toBe(400);
        expect(res.body).toBe("valid list id required");
      });

      test("put should not create todonote with wrong done type", async () => {
        //act
        const res = await agent
          .put(`/todolists/${listid}/todonotes/${id}`)
          .send({
            ...todonote,
            done: "false",
          });
        //assert
        expect(res.status).toBe(400);
        expect(res.body).toBe("done should be boolean type");
      });
      test("put should not create todonote with wrong priority type", async () => {
        //act
        const res = await agent
          .put(`/todolists/${listid}/todonotes/${id}`)
          .send({
            ...todonote,
            priority: "1",
          });
        //assert
        expect(res.status).toBe(400);
        expect(res.body).toBe("priority should be integer type");
      });
      test("put should not create todonote without text", async () => {
        //act
        const res = await agent
          .put(`/todolists/${listid}/todonotes/${id}`)
          .send({
            ...todonote,
            text: "",
          });
        //assert
        expect(res.status).toBe(400);
        expect(res.body).toBe("todo text reuired");
      });
    });
  });
  describe("tests for user without access to list", () => {
    const badUser = {
      username: "baduser",
      email: "baduserEmail@gmail.com",
      password: "123",
    };
    beforeAll(async () => {
      await registerNewUser(
        badUser.email,
        badUser.username,
        badUser.password,
        null,
        null,
        "email"
      );
      await agent
        .post(`/auth`)
        .send({ email: badUser.email, password: badUser.password })
        .redirects();
    });

    test("GET request should respose access denied", async () => {
      //act
      const res = await agent.get(`/todolists/todonotes/${id}`);
      //assert
      expect(res.status).toBe(400);
      expect(res.body).toBe("access denied");
    });
    test("POST request should respose access denied", async () => {
      //act
      const res = await agent
        .post(`/todolists/${listid}/todonotes`)
        .send(todonote);
      //assert
      expect(res.status).toBe(400);
      expect(res.body).toBe("access denied");
    });
    test("PUT request should respose access denied", async () => {
      //act
      const res = await agent
        .put(`/todolists/${listid}/todonotes/${id}`)
        .send(todonote);
      //assert
      expect(res.status).toBe(400);
      expect(res.body).toBe("access denied");
    });
    test("DELETE request should respose access denied", async () => {
      //act
      const res = await agent.delete(`/todolists/todonotes/${id}`);
      //assert
      expect(res.status).toBe(400);
      expect(res.body).toBe("access denied");
    });
  });
});

//ERROR HANDLE!!
