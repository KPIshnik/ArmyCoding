describe("Al", () => {
  describe("", () => {
    beforeAll(() => {
      console.log("aa");
    });
    afterAll(() => console.log("bb"));

    describe("", () => {
      beforeAll(() => {
        console.log("zz");
      });
      afterAll(() => console.log("zzz"));
      test("bla", async () => {
        console.log("zzzz");
        expect(1).toBe(1);
      });
    });
    describe("", () => {
      beforeAll(() => {
        console.log("ass");
      });
      afterAll(() => console.log("bbsss"));
      test("bla", async () => {
        console.log("ssss");

        expect(1).toBe(1);
      });
    });
  });
  test("bla", async () => {
    console.log("Al");
    expect(1).toBe(1);
  });
});
