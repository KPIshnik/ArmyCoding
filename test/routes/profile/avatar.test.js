const request = require("supertest");
const { url } = require("../../../configs/credentials");
const clearDB = require("../../../DB/clearDB");
const serverPromise = require("../../../server");
const registerNewUser = require("../../../models/registerNewUser");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

jest.mock("bcrypt", () => {
  const originalBcript = jest.requireActual("bcrypt");
  return {
    ...originalBcript,
    compare: (pass1, pass2) => {
      return pass1 === pass2;
    },
  };
});

let server;
let agent;
let agent2;
let avatarWebp;

const tokens = {};

describe("avatar routine", () => {
  const testUser = {
    username: "testuser",
    password: "123",
    email: "testuser@test.app",
    newname: "newname",
  };

  const testUser2 = {
    username: "testuser2",
    password: "123",
    email: "testuser2@test.app",
  };

  beforeAll(async () => {
    server = await serverPromise;
    agent = request.agent(url);

    testUser.id = await registerNewUser(
      testUser.email,
      testUser.username,
      testUser.password,
      null,
      null,
      "email"
    );

    await registerNewUser(
      testUser2.email,
      testUser2.username,
      testUser2.password,
      null,
      null,
      "email"
    );
  });

  afterAll(async () => {
    await clearDB();
    await server.teardown();
    fs.unlink(
      path.join(
        __dirname,
        "../../..",
        `/public/avatars/${testUser.username}.webp`
      ),
      () => {}
    );
  });

  describe("tests with user not authirized", () => {
    describe("post request", () => {
      test("should response with 401 status and 'not authorized' msg", async () => {
        //act
        const response = await agent
          .post("/me/profile/avatar")
          .send({ file: "{ buffer: Buffer.alloc(1) }" });

        //assert
        expect(response.status).toBe(401);
      });
    });

    describe("put request", () => {
      test("should responce with 401 status and 'not authorized' msg", async () => {
        //act
        const responce = await agent
          .put("/me/profile/avatar")
          .send({ file: "{ buffer: Buffer.alloc(1) }" });

        //assert
        expect(responce.status).toBe(401);
      });
    });

    describe("delete request", () => {
      test("should responce with 401 status and 'not authorized' msg", async () => {
        //act
        const responce = await agent
          .delete("/me/profile/avatar")
          .send({ file: "{ buffer: Buffer.alloc(1) }" });

        //assert
        expect(responce.status).toBe(401);
      });
    });
  });

  describe("tests for authorized user", () => {
    let avatar;
    beforeAll(async () => {
      avatar = await fs.promises.readFile(
        path.join(__dirname, "../..", "/img/testuserAvatarBlack.png")
      );
      avatarWebp = await sharp(avatar).webp().toBuffer();
      const login = await agent
        .post(`/auth`)
        .send({ email: testUser.email, password: testUser.password });

      const login2 = await agent.post("/auth").send(testUser2);

      tokens.user2 = { ...login2.body };
      tokens.user = { ...login.body };
    });

    test("should responce with 404 not found", async () => {
      //act
      const response = await agent
        .get(`/me/profile/avatar`)
        .set("Authorization", `Bearer ${tokens.user.token}`);

      //assert
      expect(response.status).toBe(404);
    });

    test("post request", async () => {
      //act

      const response = await agent
        .post("/me/profile/avatar")
        .set("Authorization", `Bearer ${tokens.user.token}`)
        .attach("avatar", avatar, "testuserAvatarBlack.png");

      const getAvatarRes = await agent
        .get(`/me/profile/avatar`)
        .set("Authorization", `Bearer ${tokens.user.token}`);
      //assert
      expect(response.status).toBe(201);
      expect(response.body).toBe("avatar is set");
      expect(getAvatarRes.status).toBe(200);
      expect(Buffer.compare(getAvatarRes.body, avatarWebp)).toBe(0);
    });

    test("get another users avatar", async () => {
      //act
      const res = await agent
        .get(`/users/${testUser.id}/profile/avatar`)
        .set("Authorization", `Bearer ${tokens.user2.token}`);
      //assert
      expect(res.status).toBe(200);
      expect(Buffer.compare(res.body, avatarWebp)).toBe(0);
    });

    test("get another users not existing avatar", async () => {
      //act
      const res = await agent
        .get(`/users/021205da-d87b-11ed-afa1-0242ac120002/profile/avatar`)
        .set("Authorization", `Bearer ${tokens.user2.token}`);
      //assert
      expect(res.status).toBe(404);
    });

    test("renaming avatar after renaming user", async () => {
      //arrange
      await agent
        .post("/me/profile/username")
        .set("Authorization", `Bearer ${tokens.user.token}`)
        .send({
          username: testUser.newname,
          password: testUser.password,
        });

      //act
      const getAvatarRes = await agent
        .get(`/me/profile/avatar`)
        .set("Authorization", `Bearer ${tokens.user.token}`);

      //assert
      expect(getAvatarRes.status).toBe(200);
      expect(Buffer.compare(getAvatarRes.body, avatarWebp)).toBe(0);
    });
    test("put request", async () => {
      //arrange
      const newAvatar = await fs.promises.readFile(
        path.join(__dirname, "../..", "/img/testuserAvatarWhite.png")
      );
      //act

      const response = await agent
        .put("/me/profile/avatar")
        .set("Authorization", `Bearer ${tokens.user.token}`)
        .attach("avatar", newAvatar, "testuserAvatarWhite.png");

      const getAvatarRes = await agent
        .get(`/me/profile/avatar`)
        .set("Authorization", `Bearer ${tokens.user.token}`);

      const newAvatarWebp = await sharp(newAvatar).webp().toBuffer();
      //assert
      expect(response.status).toBe(200);
      expect(getAvatarRes.status).toBe(200);
      expect(Buffer.compare(getAvatarRes.body, newAvatarWebp)).toBe(0);
    });

    test("delete request", async () => {
      //act

      const response = await agent
        .delete("/me/profile/avatar")
        .set("Authorization", `Bearer ${tokens.user.token}`);

      const getAvatarRes = await agent
        .get(`/me/profile/avatar`)
        .set("Authorization", `Bearer ${tokens.user.token}`);

      //assert
      expect(response.status).toBe(200);
      expect(getAvatarRes.status).toBe(404);
    });
  });
});

//ERROR HANDLE!!
