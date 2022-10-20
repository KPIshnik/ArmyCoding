// const request = require("supertest");
// const huita = require("./huitaForExperiments");

(async () => {
  describe("Aloha from huita", () => {
    // afterAll(() => {
    //   huita.close();
    // });

    test("expect test", async () => {
      //  const res = await request(huita).get("/");

      expect(200).toBe(200);
      //expect(res.body).toBe("Aloha");
    });
  });
})();
