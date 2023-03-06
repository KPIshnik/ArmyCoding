const pool = require("../models/DBconnection");
const huita = require("./huitaForExperiments");
const poeben = require("./poeben");

describe("Al", () => {
  beforeAll(async () => {
    await huita.createHuinya();
  });

  afterAll(async () => {
    await huita.clearHuinya();
    pool.end();
  });
  test("bla", async () => {
    await huita.insertMultipleHuita();
    const name = await huita.getHuita("faza");
    expect(name).toBe("faza");
  });
});
