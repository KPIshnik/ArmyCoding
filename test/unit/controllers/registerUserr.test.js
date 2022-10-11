const registerUser = require("../../../controllers/registerUserr");

// *******
// Мокаю все импорты в registerUser
jest.mock("../../../models/checkIsRegistered");
jest.mock("../../../models/registerNewUser");
jest.mock("../../../helpers/сonfirmEmailHelper");
jest.mock("../../../models/checkUniqueUsername");

const checkIsRegistered = require("../../../models/checkIsRegistered");
const registerNewUser = require("../../../models/registerNewUser");
const сonfirmEmailHelper = require("../../../helpers/сonfirmEmailHelper");
const checkUniqueUsername = require("../../../models/checkUniqueUsername");
//***** */

describe("Register user controller test", () => {
  // ********************
  // мокаю Responce
  const mockResponse = {
    status: jest.fn(() => {
      return mockResponse;
    }),
    json: jest.fn(() => {
      return mockResponse;
    }),
    sendStatus: jest.fn(),
  };
  //********************* */

  //** */
  const mockNextFunction = jest.fn();
  //** */

  beforeEach(() => {
    mockResponse.status.mockClear(); // сброс(очистка всех вызовов)
    mockResponse.json.mockClear(); // сброс(очистка всех вызовов)
    сonfirmEmailHelper.mockClear(); // сброс(очистка всех вызовов)
    registerNewUser.mockClear(); // сброс(очистка всех вызовов)
    checkIsRegistered.mockReset(); // сброс(очистка всех заданых ответов)
    checkUniqueUsername.mockReset(); // сброс(очистка всех ответов)
  });

  describe("testing with differen user data", () => {
    beforeEach(() => {
      checkIsRegistered.mockResolvedValueOnce(false); // Один раз выдать фалс
      checkUniqueUsername.mockResolvedValueOnce(true); // Один раз выдать тру
    });

    test("should register useer with correct data", async () => {
      //arrange
      const testUser = {
        userName: "Bob",
        password: "123",
        password2: "123",
        email: "bob@gmail.com",
      };

      const mockRequest = { body: testUser }; // мокаю запрос

      //act
      await registerUser(mockRequest, mockResponse, mockNextFunction);

      //assert
      // *****
      // проверяю что  респонс вызван с праильными аргументами
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        `user ${testUser.userName} registered, please confirm email`
      );

      // ***********
      expect(сonfirmEmailHelper).toHaveBeenCalledTimes(1); // проверка на количесвто вызвовов

      // проверяю что  registerNewUser вызван с праильными аргументами
      expect(registerNewUser).toHaveBeenCalledWith(
        null,
        testUser.userName,
        expect.any(String), // тут хз надо ли проверять что пароль хэшнут и как это делать
        null,
        null,
        "email"
      );

      // проверяю что  сonfirmEmailHelper вызван с праильными аргументами
      expect(сonfirmEmailHelper).toHaveBeenCalledWith(
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

      expect(сonfirmEmailHelper).toHaveBeenCalledTimes(0); // проверяю чтоб не был вызван
      expect(registerNewUser).toHaveBeenCalledTimes(0); // проверяю чтоб не был вызван
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

      expect(сonfirmEmailHelper).toHaveBeenCalledTimes(0);
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

      expect(сonfirmEmailHelper).toHaveBeenCalledTimes(0);
      expect(registerNewUser).toHaveBeenCalledTimes(0);
    });
  });

  test("should not register user with not unique email", async () => {
    //arrange
    checkIsRegistered.mockReturnValueOnce(true); // один раз вернуть тру
    checkUniqueUsername.mockReturnValueOnce(true); // один раз вернуть тру

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
    expect(сonfirmEmailHelper).toHaveBeenCalledTimes(0);
    expect(registerNewUser).toHaveBeenCalledTimes(0);
  });

  test("should not register user with not unique usename", async () => {
    //arrange
    checkIsRegistered.mockReturnValueOnce(false); // один раз вернуть фалс
    checkUniqueUsername.mockReturnValueOnce(false); // один раз вернуть фалс

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
    expect(сonfirmEmailHelper).toHaveBeenCalledTimes(0);
    expect(registerNewUser).toHaveBeenCalledTimes(0);
  });

  test(" when throws unhandled exception, should response with 500", async () => {
    // ???
  });

  // when register new user throws unhandled exception, should response with 500
});
