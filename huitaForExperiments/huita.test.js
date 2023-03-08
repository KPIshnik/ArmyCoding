const pool = require("../models/DBconnection");
const huita = require("./huitaForExperiments");

describe("Al", () => {
  beforeAll(async () => {
    await huita.createHuinya();
  });

  afterAll(async () => {
    await huita.clearHuinya();
    pool.end();
  });
  test("bla", async () => {
    const arr = [
      "a",
      "b",
      "c",
      "c",
      "c",
      "c",
      "c",
      "c",
      "b",
      "b",
      "b",
      "a",
      "b",
      "c",
      "c",
      "c",
      "c",
      "c",
      "c",
      "b",
      "b",
      "b",
    ];

    await huita.insertMultipleHuita(arr);

    const name = await huita.getHuita(arr[1]);

    expect(name).toBe(arr[1]);
  });
});
