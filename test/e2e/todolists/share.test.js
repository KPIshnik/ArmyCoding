const request = require("supertest");
const superagent = require("superagent");
const { testmail } = require("../../../configs/credentials");
const clearDB = require("../../../DB/clearDB");
const serverPromise = require("../../../server");
const registerNewUser = require("../../../models/registerNewUser");
const { url } = require("../../../configs/config");

jest.mock("bcrypt", () => {
  const originalBcript = jest.requireActual("bcrypt");
  return {
    ...originalBcript,
    compare: (pass1, pass2) => {
      return pass1 === pass2;
    },
  };
});

jest.setTimeout(20000);
const date = Date.now();

let server;
const agent = request.agent(url);

describe("/todolist/share", () => {
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
  const tokens = {};
  beforeAll(async () => {
    server = await serverPromise;

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
    const todolistArr = [todolist, todolist2, todolist3];

    const sharedUsersarr = [testUser2, testUser4];
    const emails = [testUser2.email, testUser4.email];

    beforeAll(async () => {
      const res1 = await agent
        .post(`/auth`)
        .send({ email: testUser.email, password: testUser.password });
      tokens.user1 = { ...res1.body };

      const res2 = await agent
        .post(`/auth`)
        .send({ email: testUser2.email, password: testUser2.password });
      tokens.user2 = { ...res2.body };

      const res3 = await agent
        .post(`/auth`)
        .send({ email: testUser3.email, password: testUser3.password });
      tokens.user3 = { ...res3.body };

      const res4 = await agent
        .post(`/auth`)
        .send({ email: testUser4.email, password: testUser4.password });
      tokens.user4 = { ...res4.body };

      for (list of todolistArr) {
        const res = await agent
          .post("/todolists")
          .set("Authorization", `Bearer ${tokens.user1.token}`)
          .send(list);
        list.id = res.body.data.id;
      }
    });
    describe("succes tests", () => {
      let listid;
      let emails;
      let sharedUsers;

      beforeAll(() => {
        listid = todolist.id;
        sharedUsers = [testUser2, testUser3];
        emails = [testUser2.email, testUser3.email];
        updateUsers = [testUser3, testUser4];
        updateUsersEmails = [testUser3.email, testUser4.email];
      });
      describe("SHARE", () => {
        test(`POST request should share todolist response with code 200,
      msg(todonote created) `, async () => {
          //arrange

          //act

          const res = await agent
            .post(`/todolists/${listid}/share`)
            .set("Authorization", `Bearer ${tokens.user1.token}`)
            .send({ emails });

          for (list of todolistArr) {
            const listid = list.id;
            await agent
              .post(`/todolists/${listid}/share`)
              .set("Authorization", `Bearer ${tokens.user1.token}`)
              .send({ emails: [testUser2.email] });
          }

          // const recivedEmails = [];
          // for (user of sharedUsers) {
          //   const testmailResponse = await superagentget(
          //     `https://api.testmail.app/api/json?apikey=${testmail.api_key}&namespace=${testmail.namespace}&tag=${user.username}&timestamp_from=${date}&livequery=true`
          //   );
          //   recivedEmails.push(testmailResponse.body.emails[0]);
          // }

          //assert
          expect(res.status).toBe(200);
          expect(res.body).toBe(`list ${listid} shared `);

          // expect(recivedEmails.length).toBe(sharedUsers.length);
          // recivedEmails.forEach((email) => {
          //   expect(email.subject).toBe("todolists app. New access granted");
          //   expect(email.text).toBe(
          //     `user ${testUser.username} shred "${todolist.listname}" todolist with you`
          //   );
          // });
        });

        test("get request should response with status 200 ", async () => {
          const getRes = await agent
            .get(`/todolists/${todolist.id}/share`)
            .set("Authorization", `Bearer ${tokens.user1.token}`);
          //act
          expect(getRes.status).toBe(200);
          expect(getRes.body.length).toBe(emails.length);

          getRes.body.forEach((user, i) => {
            expect(user).toEqual({
              email: sharedUsers[i].email,
              username: sharedUsers[i].username,
              id: expect.anything(),
            });
          });
        });

        test(`Get permitted todolist, should response with 200 code 
        and send list od todolist`, async () => {
          //arrange
          todolistArr.sort((a, b) => a.listname - b.listname);
          //act
          const res = await agent
            .get("/todolists/permitted")
            .set("Authorization", `Bearer ${tokens.user2.token}`);
          //assert

          expect(res.status).toBe(200);
          expect(res.body.length).toBe(todolistArr.length);
          todolistArr.forEach((list, i) => {
            expect(res.body[i].listname).toBe(list.listname);
          });
        });

        test(`get permitted todolist, shuold responce with 200 code, 
        and send todolist `, async () => {
          //arrange
          const sortedTodos = [...todolist.todos].sort(
            (todo1, todo2) => todo1.priority - todo2.priority
          );
          //act
          const res = await agent
            .get(`/todolists/permitted/${todolist.id}`)
            .set("Authorization", `Bearer ${tokens.user2.token}`);
          //assert
          expect(res.status).toBe(200);
          expect(res.body.listname).toBe(todolist.listname);

          expect(res.body.todos.length).toBe(todolist.todos.length);

          res.body.todos.forEach((todo, i) => {
            expect(todo).toEqual({
              id: expect.anything(),
              text: sortedTodos[i].text,
              done: sortedTodos[i].done,
              priority: i + 1,
            });
          });
        });
      });

      describe("unshare", () => {
        test("delete, should response with 204", async () => {
          const res = await agent
            .delete(`/todolists/${listid}/share/${emails[1]}`)
            .set("Authorization", `Bearer ${tokens.user1.token}`);

          expect(res.status).toBe(204);
        });

        test("get request should response with status 200 ", async () => {
          const getRes = await agent
            .get(`/todolists/${todolist.id}/share/`)
            .set("Authorization", `Bearer ${tokens.user1.token}`);
          //act
          expect(getRes.status).toBe(200);
          expect(getRes.body.length).toBe(emails.length - 1);

          getRes.body.forEach((user, i) => {
            expect(user).toEqual({
              email: sharedUsers[i].email,
              username: sharedUsers[i].username,
              id: expect.anything(),
            });
          });
        });

        test(`get permitted todolist, shuold responce with 400 code,
        acces denied `, async () => {
          //act
          const res = await agent
            .get(`/todolists/permitted/${listid}`)
            .set("Authorization", `Bearer ${tokens.user3.token}`);
          //assert
          expect(res.status).toBe(400);
          expect(res.body).toBe("access denied");
        });
      });

      describe("update sharing ", () => {
        test("put request,  should  eresponce with 204 code", async () => {
          //act
          const res = await agent
            .put(`/todolists/${listid}/share`)
            .send({
              listid,
              emails: updateUsersEmails,
            })
            .set("Authorization", `Bearer ${tokens.user1.token}`);

          //assert
          expect(res.status).toBe(204);
        });

        test("get request should response with status 200 ", async () => {
          const getRes = await agent
            .get(`/todolists/${todolist.id}/share`)
            .set("Authorization", `Bearer ${tokens.user1.token}`);
          //act
          expect(getRes.status).toBe(200);
          expect(getRes.body.length).toBe(updateUsersEmails.length);

          getRes.body.forEach((user, i) => {
            expect(user).toEqual({
              email: updateUsers[i].email,
              username: updateUsers[i].username,
              id: expect.anything(),
            });
          });
        });

        test(`get permitted todolist fort testuser3, shuold responce with 200 code,
        and send todolist `, async () => {
          //arrange
          const sortedTodos = [...todolist.todos].sort(
            (todo1, todo2) => todo1.priority - todo2.priority
          );
          //act
          const res = await agent
            .get(`/todolists/permitted/${todolist.id}`)
            .set("Authorization", `Bearer ${tokens.user3.token}`);
          //assert
          expect(res.status).toBe(200);
          expect(res.body.listname).toBe(todolist.listname);

          expect(res.body.todos.length).toBe(todolist.todos.length);

          res.body.todos.forEach((todo, i) => {
            expect(todo).toEqual({
              id: expect.anything(),
              text: sortedTodos[i].text,
              done: sortedTodos[i].done,
              priority: i + 1,
            });
          });
        });

        test(`get permitted todolist for testuser4, shuold responce with 200 code,
        and send todolist `, async () => {
          //arrange
          const sortedTodos = [...todolist.todos].sort(
            (todo1, todo2) => todo1.priority - todo2.priority
          );
          //act
          const res = await agent
            .get(`/todolists/permitted/${todolist.id}`)
            .set("Authorization", `Bearer ${tokens.user4.token}`);
          //assert
          expect(res.status).toBe(200);
          expect(res.body.listname).toBe(todolist.listname);

          expect(res.body.todos.length).toBe(todolist.todos.length);

          res.body.todos.forEach((todo, i) => {
            expect(todo).toEqual({
              id: expect.anything(),
              text: sortedTodos[i].text,
              done: sortedTodos[i].done,
              priority: i + 1,
            });
          });
        });

        test(`get permitted todolist, should responce with 200 code,
        and send todolist `, async () => {
          //act
          const res = await agent
            .get(`/todolists/permitted/${todolist.id}`)
            .set("Authorization", `Bearer ${tokens.user2.token}`);
          //assert
          expect(res.status).toBe(400);
          expect(res.body).toBe("access denied");
        });
      });

      describe("acces tests", () => {
        test("try to share not your list", async () => {
          //act
          const res = await agent
            .post(`/todolists/${listid}/share`)
            .set("Authorization", `Bearer ${tokens.user2.token}`)
            .send({ emails });
          //assert
          expect(res.status).toBe(400);
          expect(res.body).toBe("access denied");
        });

        test("try to unshare not your list", async () => {
          const res = await agent
            .delete(`/todolists/${listid}/share/${emails[1]}`)
            .set("Authorization", `Bearer ${tokens.user2.token}`);
          //assert
          expect(res.status).toBe(400);
          expect(res.body).toBe("access denied");
        });

        test("try to update sharing of not your list", async () => {
          //act
          const res = await agent
            .put(`/todolists/${listid}/share`)
            .set("Authorization", `Bearer ${tokens.user2.token}`)
            .send({
              emails: updateUsersEmails,
            });

          //assert
          expect(res.status).toBe(400);
          expect(res.body).toBe("access denied");
        });
      });
    });

    describe("feilure tests", () => {
      test("get request", async () => {
        //act
        const res = await agent
          .get(`/todolists/badid/share`)
          .set("Authorization", `Bearer ${tokens.user1.token}`);
        //assert
        expect(res.status).toBe(400);
        expect(res.body).toBe("valid id required");
      });
      describe("post requests", () => {
        test("bad listid, should responce code 400, 'valid id requires' msg", async () => {
          //act
          const res = await agent
            .post(`/todolists/badid/share`)
            .set("Authorization", `Bearer ${tokens.user1.token}`)
            .send({
              emails: ["somemail@gmail.com"],
            });
          //assert
          expect(res.status).toBe(400);
          expect(res.body).toBe("valid id required");
        });

        test("bad emails, should responce code 400, 'valid emails requires' msg", async () => {
          //act
          const res = await agent
            .post(`/todolists/${todolist.id}/share`)
            .set("Authorization", `Bearer ${tokens.user1.token}`)
            .send({
              emails: ["somemail@gmail.com", "some2mail@gmail.com", 2],
            });
          //assert
          expect(res.status).toBe(400);
          expect(res.body).toBe("valid emails required");
        });
      });
      describe("put request", () => {
        test("bad listid, should responce code 400, 'valid id requires' msg", async () => {
          //act
          const res = await agent
            .put(`/todolists/badid/share`)
            .set("Authorization", `Bearer ${tokens.user1.token}`)
            .send({
              emails: ["somemail@gmail.com"],
            });
          //assert
          expect(res.status).toBe(400);
          expect(res.body).toBe("valid id required");
        });

        test("bad emails, should responce code 400, 'valid emails requires' msg", async () => {
          //act
          const res = await agent
            .put(`/todolists/${todolist.id}/share`)
            .set("Authorization", `Bearer ${tokens.user1.token}`)
            .send({
              emails: ["somemail@gmail.com", true, "some2mail@gmail.com"],
            });
          //assert
          expect(res.status).toBe(400);
          expect(res.body).toBe("valid emails required");
        });
      });
      describe("delete request", () => {
        test("bad listid, should responce code 400, 'valid id requires' msg", async () => {
          //act
          const res = await agent
            .delete(`/todolists/${"todolist.id"}/share/${"email"}`)
            .set("Authorization", `Bearer ${tokens.user1.token}`);
          //assert
          expect(res.status).toBe(400);
          expect(res.body).toBe("valid id required");
        });
      });
      test("permitted get request", async () => {
        //act
        const res = await agent
          .get(`/todolists/permitted/badid`)
          .set("Authorization", `Bearer ${tokens.user1.token}`);
        //assert
        expect(res.status).toBe(400);
        expect(res.body).toBe("valid id required");
      });
    });
  });
  describe("tests with user not authirized", () => {
    beforeAll(async () => {
      await agent.delete("/auth");
    });
    describe("get request", () => {
      test("should response with 401 status and 'not authorized' msg", async () => {
        //act
        const response = await agent.get(`/todolists/id/share`);

        //assert
        expect(response.status).toBe(401);
      });
    });

    describe("/permitted get requests", () => {
      test("should response with 401 status and 'not authorized' msg", async () => {
        //act
        const response = await agent.get(`/todolists/id/share`);

        //assert
        expect(response.status).toBe(401);
      });
      test("should response with 401 status and 'not authorized' msg", async () => {
        //act
        const response = await agent.get("/todolists/permitted");

        //assert
        expect(response.status).toBe(401);
      });
    });

    describe("post request", () => {
      test("should responce with 401 status and 'not authorized' msg", async () => {
        //act
        const responce = await agent
          .post("/todolists/id/share")
          .send("fakedata");

        //assert
        expect(responce.status).toBe(401);
      });
    });

    test("PUT request, responce with 401 status and 'not authorized' msg", async () => {
      //arrange
      //act
      const res = await agent.put(`/todolists/id/share`).send("fakedata");
      //assert
      expect(res.status).toBe(401);
    });

    test("DELETE request, responce with 401 status and 'not authorized' msg", async () => {
      //arrange
      //act
      const res = await agent.delete(`/todolists/id/share/email`);
      //assert
      expect(res.status).toBe(401);
    });
  });
});
