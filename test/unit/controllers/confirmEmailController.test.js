jest.mock("../../../models/getUserByUsename");
jest.mock("../../../models/setUserEmail");
jest.mock("../../../models/getUserDataByKey");

//mock date
const setUserEmail = require("../../../models/setUserEmail");
const getUserDataByKey = require("../../../models/getUserDataByKey");
const { confirmEmailExpireTime } = require("../../../configs/settings");
const confirmEmailController = require("../../../controllers/confirmEmailController");

describe("Confirm email controller tests", () => {
  const mockNextFunction = jest.fn();

  const mockResponse = {
    status: jest.fn(() => {
      return mockResponse;
    }),
    json: jest.fn(() => {
      return mockResponse;
    }),
    sendStatus: jest.fn(),
  };

  const mockRequest = {
    query: { key: "1" },
  };

  const userData = {};

  getUserDataByKey.mockResolvedValue(userData);

  beforeEach(() => {
    //Validation???
    userData.id = 3;
    userData.email = "bob@gmail.com";
    userData.date = Date.now(); // - confirmEmailExpireTime - 10,

    mockRequest.query.key = "1";

    setUserEmail.mockClear();
    getUserDataByKey.mockClear();
    mockResponse.status.mockClear();
    mockResponse.json.mockClear();
  });

  test("should confirm email when everything ok", async () => {
    //arrange

    //act

    await confirmEmailController(mockRequest, mockResponse, mockNextFunction);

    //assert

    expect(setUserEmail).toHaveBeenCalledWith(userData.id, userData.email);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith("Email confirmed");
  });

  test('shuold return code:  400 msg: "valid key required", when key is missing', async () => {
    //arrange
    mockRequest.query.key = "";

    //act

    await confirmEmailController(mockRequest, mockResponse, mockNextFunction);

    //assert

    expect(setUserEmail).toHaveBeenCalledTimes(0);
    expect(getUserDataByKey).toHaveBeenCalledTimes(0);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith("valid key required");
  });

  test('sholud return code:  400 msg: "confirm key expired", when key is expired', async () => {
    //arrange
    userData.date = Date.now() - confirmEmailExpireTime;
    //act

    await confirmEmailController(mockRequest, mockResponse, mockNextFunction);

    //assert

    expect(setUserEmail).toHaveBeenCalledTimes(0);
    expect(getUserDataByKey).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith("confirm key expired");
  });

  test('shuold return code:  400 msg: "bad data, reregister", when no user.email or user.id', async () => {
    //arrange
    userData.email = null;
    //act

    await confirmEmailController(mockRequest, mockResponse, mockNextFunction);

    //assert

    expect(setUserEmail).toHaveBeenCalledTimes(0);
    expect(getUserDataByKey).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith("bad data, reregister");
  });

  // test('shuold return code:  500 msg: "something went wrong", when err ocurs', async () => {});
});
