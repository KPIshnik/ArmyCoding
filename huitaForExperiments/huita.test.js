jest.mock("./poeben");

const sum = require("./poeben");
describe("", () => {
  describe("testing hueta", () => {
    beforeEach(() => {
      sum.mockReturnValueOnce(5);
    });
    test("testing hueta", () => {
      expect(sum(100)).toBe(5);
    });
    test("testing hueta", () => {
      expect(sum(0)).toBe(5);
    });
  });
  test("testing hueta", () => {
    expect(sum(10)).toBe(5);
  });
});
