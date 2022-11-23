const registerUser = require("../../../controllers/registerUserr");
const bcript = require("bcrypt");
const checkIsRegistered = require("../../../models/checkIsRegistered");
const registerNewUser = require("../../../models/registerNewUser");
const сonfirmEmailHelper = require("../../../helpers/confirmEmailHelper");
const checkUniqueUsername = require("../../../models/checkUniqueUsername");

// *******
// Мокаю все импорты в registerUser
jest.mock("../../../models/checkIsRegistered");
jest.mock("../../../models/registerNewUser");
jest.mock("../../../helpers/confirmEmailHelper");
jest.mock("../../../models/checkUniqueUsername");
jest.mock("bcrypt", () => {
  const originalBcript = jest.requireActual("bcrypt");
  return {
    ...originalBcript,
    hash: (pass) => {
      return `hashed ${pass}`;
    },
  };
});

describe("Register user controller test", () => {
  // ********************

  // bcript = jest.fn(async (pass) => {
  //   return `hashed ${pass} `;
  // });

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
    test("should register useer with correct data", async () => {
      //arrange
      checkIsRegistered.mockResolvedValueOnce(false); // Один раз выдать фалс
      checkUniqueUsername.mockResolvedValueOnce(true);

      const testUser = {
        userName: "Bob",
        password: "123",
        password2: "123",
        email: "validmail@gmail.com",
        valid: true,
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
        `hashed ${testUser.password}`, // тут хз надо ли проверять что пароль хэшнут и как это делать
        null,
        null,
        "email"
      );

      // проверяю что  сonfirmEmailHelper вызван с праильными аргументами
      expect(сonfirmEmailHelper).toHaveBeenCalledWith(
        testUser.id,
        testUser.email
      );
    });

    test("should not register user with not unique email", async () => {
      //arrange
      checkIsRegistered.mockResolvedValueOnce(true); // один раз вернуть тру
      checkUniqueUsername.mockReturnValueOnce(true); // один раз вернуть тру

      const testUser = {
        userName: "Bob",
        password: "123",
        password2: "123",
        email: "validmail@gmail.com",
        valid: true,
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

    test("should not register user with not unique username", async () => {
      //arrange
      checkIsRegistered.mockReturnValueOnce(false); // один раз вернуть фалс
      checkUniqueUsername.mockReturnValueOnce(false); // один раз вернуть фалс

      const testUser = {
        userName: "Bob",
        password: "123",
        password2: "123",
        email: "validmail@gmail.com",
        valid: true,
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
      // arrange
      const testUser = {
        userName: "Bob",
        password: "123",
        password2: "123",
        email: "validmail@gmail.com",
      };

      const mockRequest = { body: testUser };

      //act
      await registerUser(mockRequest, mockResponse, mockNextFunction);

      //assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith("Oops, server error((");
    });
  });
});
