//+//
const request = require("supertest");
const { url, testmail } = require("../../configs/credentials");
const clearDB = require("../../DB/clearDB");
const getEmailConfirmDataById = require("../../models/getEmailConfirmDataById");
const getUserByUserName = require("../../models/getUserByUsename");
const serverPromise = require("../../server");
const superagent = require("superagent");
const clearDbTables = require("../../DB/clearDbTables");
const { response } = require("../../app");
const registerNewUser = require("../../models/registerNewUser");

let server;

describe("/profile/avatar ", () => {
  beforeAll(async () => {
    server = await serverPromise;
  });

  beforeEach(async () => {
    await clearDbTables();
  });

  afterAll(async () => {
    await clearDB();
    await server.teardown();
  });
  test("", () => {});
});
