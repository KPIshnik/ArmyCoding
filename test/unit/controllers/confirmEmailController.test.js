jest.mock("../../../models/getUserByUsename");
jest.mock("../../../models/setUserEmail");
jest.mock("../../../models/getUserDataByKey");

//mock date

const getUserByUserName = require("../../../models/getUserByUsename");
const setUserEmail = require("../../../models/setUserEmail");
const getUserDataByKey = require("../../../models/getUserDataByKey");
const { confirmEmailExpireTime } = require("../../../configs/settings");
const confirmEmailController = require("../../../controllers/confirmEmailController");

describe("Confirm email controller tests", () => {
  const mockResponse = {
    status: jest.fn(() => {
      return mockResponse;
    }),
    json: jest.fn(() => {
      return mockResponse;
    }),
    sendStatus: jest.fn(),
  };

  mockRequest = {
    query: {
      key: "123",
    },
  };
  const mockNextFunction = jest.fn();

  beforeEach(() => {
    getUserByUserName.mockClear();
    setUserEmail.mockClear();
    getUserDataByKey.mockClear();
  });

  test("should confirm email when everything ok", async () => {
    //arrange
    const userData = {
      id: 3,
      usenmame: "bob",
      email: "bob@gmail.com",
      date: Date.now(), // - confirmEmailExpireTime - 10,
    };
    getUserDataByKey.mockResolvedValueOnce(userData);
    getUserByUserName.mockResolvedValueOnce({ id: userData.id });

    //act

    await confirmEmailController(mockRequest, mockResponse, mockNextFunction);

    //assert

    expect(setUserEmail).toHaveBeenCalledWith(userData.id, userData.email);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith("Email confirmed");
  });
});
