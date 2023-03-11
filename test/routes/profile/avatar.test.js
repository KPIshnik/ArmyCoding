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

describe("/profile/avatar", () => {
  const testUser = {
    username: "testuser",
    password: "123",
    email: "testuser@test.app",
  };

  beforeAll(async () => {
    server = await serverPromise;
    agent = request.agent(url);
    const id = await registerNewUser(
      testUser.email,
      testUser.username,
      testUser.password,
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
          .post("/profile/avatar")
          .send({ file: "{ buffer: Buffer.alloc(1) }" });

        //assert
        expect(response.status).toBe(401);
        expect(response.body).toBe("not authorized");
      });
    });

    describe("put request", () => {
      test("should responce with 401 status and 'not authorized' msg", async () => {
        //act
        const responce = await agent
          .put("/profile/avatar")
          .send({ file: "{ buffer: Buffer.alloc(1) }" });

        //assert
        expect(responce.status).toBe(401);
        expect(responce.body).toBe("not authorized");
      });
    });

    describe("delete request", () => {
      test("should responce with 401 status and 'not authorized' msg", async () => {
        //act
        const responce = await agent
          .delete("/profile/avatar")
          .send({ file: "{ buffer: Buffer.alloc(1) }" });

        //assert
        expect(responce.status).toBe(401);
        expect(responce.body).toBe("not authorized");
      });
    });
  });

  describe("tests for authorized user", () => {
    let avatar;
    beforeAll(async () => {
      avatar = await fs.promises.readFile(
        path.join(__dirname, "../..", "/img/testuserAvatarBlack.png")
      );
      await agent
        .post(`/auth`)
        .send({ email: testUser.email, password: testUser.password });
    });

    test("should responce with 404 not found", async () => {
      //act
      const response = await agent
        .get(`/profile/avatar?username=${testUser.username}`)
        .redirects();

      //assert
      expect(response.status).toBe(404);
    });

    test("post request", async () => {
      //act

      const response = await agent
        .post("/profile/avatar")
        .attach("avatar", avatar, "testuserAvatarBlack.png");

      const getAvatarRes = await agent
        .get(`/profile/avatar?username=${testUser.username}`)
        .redirects();

      const avatarWebp = await sharp(avatar).webp().toBuffer();
      //assert
      expect(response.status).toBe(201);
      expect(response.body).toBe("avatar is set");
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
        .put("/profile/avatar")
        .attach("avatar", newAvatar, "testuserAvatarWhite.png");

      const getAvatarRes = await agent
        .get(`/profile/avatar?username=${testUser.username}`)
        .redirects();

      const newAvatarWebp = await sharp(newAvatar).webp().toBuffer();
      //assert
      expect(response.status).toBe(200);
      expect(response.body).toBe(`avatar for ${testUser.username} updated`);
      expect(getAvatarRes.status).toBe(200);
      expect(Buffer.compare(getAvatarRes.body, newAvatarWebp)).toBe(0);
    });

    test("delete request", async () => {
      //act

      const response = await agent.delete("/profile/avatar");

      const getAvatarRes = await agent
        .get(`/profile/avatar?username=${testUser.username}`)
        .redirects();

      //assert
      expect(response.status).toBe(200);
      expect(response.body).toBe(
        `${testUser.username} avatar has been deleted`
      );
      expect(getAvatarRes.status).toBe(404);
    });
  });
});

//ERROR HANDLE!!
