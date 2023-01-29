const huita = require("./huitaForExperiments");
const poeben = require("./poeben");

jest.mock("./poeben", () => {
  return jest.fn(jest.requireActual("./poeben")); //);
});

test("bla", () => {
  huita();

  expect(poeben).toHaveBeenCalled();
});
