const registerUserValidator = require("../../../../middlewares/validators/registerUserValidator");

describe("Register user  VALIDATOR test", () => {
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
  });

  describe("testing with differen user data", () => {
    test("should set req.user. valid = true and call next, when request is valid", async () => {
      //arrange

      const testUser = {
        userName: "Bob",
        password: "123",
        password2: "123",
        email: "validemail@gmail.com",
      };

      const request = { body: testUser }; // мокаю запрос

      //act
      await registerUserValidator(request, mockResponse, mockNextFunction);

      //assert

      expect(mockResponse.status).toHaveBeenCalledTimes(0);
      expect(mockResponse.json).toHaveBeenCalledTimes(0);

      // проверяю что  сonfirmEmailHelper вызван с праильными аргументами
      expect(mockNextFunction).toHaveBeenCalledTimes(1);
      expect(request.body.valid).toBe(true);
    });

    test("should not validate not matching pass", async () => {
      //arrange
      const testUser = {
        userName: "Bob",
        password: "123",
        password2: "1234",
        email: "validemail@gmail.com",
      };
      const request = { body: testUser };

      //act
      await registerUserValidator(request, mockResponse, mockNextFunction);

      //assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        `pass too short or does not match`
      );

      expect(request.body.valid).toBe(false);
    });

    test("should not validate empty username", async () => {
      //arrange
      const testUser = {
        userName: "",
        password: "123",
        password2: "123",
        email: "validemail@gmail.com",
      };
      const request = { body: testUser };

      //act
      await registerUserValidator(request, mockResponse, mockNextFunction);

      //assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(`username missing`);

      expect(request.body.valid).toBe(false);
    });

    test("should not validate empty email", async () => {
      //arrange
      const testUser = {
        userName: "Bob",
        password: "123",
        password2: "123",
        email: "",
      };
      const request = { body: testUser };

      //act
      await registerUserValidator(request, mockResponse, mockNextFunction);

      //assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(`email missing`);

      expect(request.body.valid).toBe(false);
    });

    test("should not validate not valid email", async () => {
      const testUser = {
        userName: "testuser",
        password: "123",
        password2: "123",
        email: "",
      };

      const emails = [
        "abc-@mail.com",
        "abc..def@mail.com",
        ".abc@mail.com",
        "abc#def@mail.com",
        "abc.def@mail.c",
        "abc.def@mail#archive.com",
        "abc.def@mail",
        "abc.def@mail..com",
        "qwe",
        "@qwe",
        "qwe@",
      ];

      for (const email of emails) {
        testUser.email = email;

        const request = { body: testUser };

        await registerUserValidator(request, mockResponse, mockNextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith("email not valid");

        expect(request.body.valid).toBe(false);
      }
    });
  });
});
