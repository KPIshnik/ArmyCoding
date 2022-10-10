const registerUser = require("../../../controllers/registerUserr");
jest.mock("../../../models/checkIsRegistered");
jest.mock("../../../models/registerNewUser");
jest.mock("../../../helpers/sendConfirmEmailHelper");
jest.mock("../../../models/checkUniqueUsername");

const checkIsRegistered = require("../../../models/checkIsRegistered");
const registerNewUser = require("../../../models/registerNewUser");
const sendConfirmEmailHelper = require("../../../helpers/sendConfirmEmailHelper");
const checkUniqueUsername = require("../../../models/checkUniqueUsername");

describe("Register user controller test", () => {
  //hashed pass??

  const mockResponse = {
    status: jest.fn(() => {
      return mockResponse;
    }),
    json: jest.fn(() => {
      return mockResponse;
    }),
    sendStatus: jest.fn(),
  };

  const mockNextFunction = jest.fn();

  beforeEach(() => {
    mockResponse.status.mockClear();
    mockResponse.json.mockClear();
    sendConfirmEmailHelper.mockClear();
    registerNewUser.mockClear();
    checkIsRegistered.mockReset();
    checkUniqueUsername.mockReset();
  });

  describe("testing with differen user data", () => {
    beforeEach(() => {
      checkIsRegistered.mockResolvedValueOnce(false);
      checkUniqueUsername.mockResolvedValueOnce(true);
    });

    test("should register useer with correct data", async () => {
      //arrange
      const testUser = {
        userName: "Bob",
        password: "123",
        password2: "123",
        email: "bob@gmail.com",
      };

      const mockRequest = { body: testUser };

      //act
      await registerUser(mockRequest, mockResponse, mockNextFunction);

      //assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        `user ${testUser.userName} registered, please confirm email`
      );

      expect(sendConfirmEmailHelper).toHaveBeenCalledTimes(1);
      expect(registerNewUser).toHaveBeenCalledTimes(1);

      expect(registerNewUser).toHaveBeenCalledWith(
        null,
        testUser.userName,
        expect.any(String),
        null,
        null,
        "email"
      );

      expect(sendConfirmEmailHelper).toHaveBeenCalledWith(
        testUser.userName,
        testUser.email
      );
    });

    test("should not register user with not matching pass", async () => {
      //arrange
      const testUser = {
        userName: "Bob",
        password: "123",
        password2: "1234",
        email: "bob@gmail.com",
      };
      const mockRequest = { body: testUser };

      //act
      await registerUser(mockRequest, mockResponse, mockNextFunction);

      //assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        `pass too short or does not match`
      );

      expect(sendConfirmEmailHelper).toHaveBeenCalledTimes(0);
      expect(registerNewUser).toHaveBeenCalledTimes(0);
    });

    test("should not register user with empty username", async () => {
      //arrange
      const testUser = {
        userName: "",
        password: "123",
        password2: "123",
        email: "bob@gmail.com",
      };
      const mockRequest = { body: testUser };

      //act
      await registerUser(mockRequest, mockResponse, mockNextFunction);

      //assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(`username missing`);

      expect(sendConfirmEmailHelper).toHaveBeenCalledTimes(0);
      expect(registerNewUser).toHaveBeenCalledTimes(0);
    });

    test("should not register user with empty email", async () => {
      //arrange
      const testUser = {
        userName: "Bob",
        password: "123",
        password2: "123",
        email: "",
      };
      const mockRequest = { body: testUser };

      //act
      await registerUser(mockRequest, mockResponse, mockNextFunction);

      //assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(`email missing`);

      expect(sendConfirmEmailHelper).toHaveBeenCalledTimes(0);
      expect(registerNewUser).toHaveBeenCalledTimes(0);
    });
  });

  test("should not register user with not unique email", async () => {
    //arrange
    checkIsRegistered.mockReturnValueOnce(true);
    checkUniqueUsername.mockReturnValueOnce(true);

    const testUser = {
      userName: "Bob",
      password: "123",
      password2: "123",
      email: "bob@gmail.com",
    };
    const mockRequest = { body: testUser };

    //act
    await registerUser(mockRequest, mockResponse, mockNextFunction);

    //assert
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      `this email already registered, try another one`
    );

    expect(checkUniqueUsername).toHaveBeenCalledTimes(0);
    expect(sendConfirmEmailHelper).toHaveBeenCalledTimes(0);
    expect(registerNewUser).toHaveBeenCalledTimes(0);
  });

  test("should not register user with not unique usename", async () => {
    //arrange
    checkIsRegistered.mockReturnValueOnce(false);
    checkUniqueUsername.mockReturnValueOnce(false);

    const testUser = {
      userName: "Bob",
      password: "123",
      password2: "123",
      email: "bob@gmail.com",
    };
    const mockRequest = { body: testUser };

    //act
    await registerUser(mockRequest, mockResponse, mockNextFunction);

    //assert
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      `this username already registered, try another one`
    );
    expect(sendConfirmEmailHelper).toHaveBeenCalledTimes(0);
    expect(registerNewUser).toHaveBeenCalledTimes(0);
  });

  test(" when throws unhandled exception, should response with 500", async () => {
    // ???
  });

  // when register new user throws unhandled exception, should response with 500
});
