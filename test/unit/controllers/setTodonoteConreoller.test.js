jest.mock("../../../models/todilists/createTodos");
jest.mock("../../../models/todilists/getTodosByListId");
jest.mock("../../../models/todilists/updateTodos");

const setTodonoteController = require("../../../controllers/todolists/todonote/setTodonoteController");
const createTodos = require("../../../models/todilists/createTodos");
const getTodosByListId = require("../../../models/todilists/getTodosByListId");
const updateTodos = require("../../../models/todilists/updateTodos");

const res = {
  status: jest.fn(() => {
    return res;
  }),
  json: jest.fn(() => {
    return res;
  }),
  sendStatus: jest.fn(),
};

const next = jest.fn();

const todonote = {
  text: "todonote",
  priority: 2,
  done: true,
  valid: true,
};
const listid = 1;
describe("setTodonoteController", () => {
  beforeEach(() => {
    createTodos.mockClear();
    updateTodos.mockClear();
    res.status.mockClear();
  });

  test("1 todonote, priority 2", async () => {
    //arrnage

    const todos = [{ id: 1, rank: 1 }];
    const req = {
      params: {
        listid,
      },
      body: { ...todonote, priority: 2 },
    };

    const { text, done } = todonote;
    getTodosByListId.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolve(todos);
        })
    );
    //act
    await setTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(createTodos).toBeCalledWith(listid, [{ text, rank: 1000001, done }]);
    expect(updateTodos).not.toHaveBeenCalled();
  });

  test("1 todonote, priority 12", async () => {
    //arrnage
    const todos = [{ id: 1, rank: 1 }];
    const req = {
      params: {
        listid,
      },
      body: { ...todonote, priority: 12 },
    };

    const { text, done } = todonote;
    getTodosByListId.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolve(todos);
        })
    );
    //act
    await setTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(createTodos).toBeCalledWith(listid, [{ text, rank: 1000001, done }]);
    expect(updateTodos).not.toHaveBeenCalled();
  });

  test("1 todonote, prioryty 1, test rerank when on low adge ", async () => {
    //arrnage
    const todos = [{ id: 1, rank: 1 }];
    const req = {
      params: {
        listid,
      },
      body: { ...todonote, priority: 1 },
    };
    const { text, done } = todonote;
    getTodosByListId.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolve(todos);
        })
    );
    //act
    await setTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(createTodos).toBeCalledWith(listid, [{ text, rank: 1000000, done }]);
    expect(updateTodos).toHaveBeenCalledWith([{ id: 1, rank: 2000000 }]);
  });

  test("4 todonote, prioryty 1, test rerank when on low adge ", async () => {
    //arrnage
    const todos = [
      { id: 1, rank: 1 },
      { id: 2, rank: 1000 },
      { id: 3, rank: 1100 },
      { id: 4, rank: 1200 },
    ];
    const req = {
      params: {
        listid,
      },
      body: { ...todonote, priority: 1 },
    };
    const { text, done } = todonote;
    getTodosByListId.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolve(todos);
        })
    );
    //act
    await setTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(createTodos).toBeCalledWith(listid, [{ text, rank: 1000000, done }]);
    expect(updateTodos).toHaveBeenCalledWith([
      { id: 1, rank: 2000000 },
      { id: 2, rank: 3000000 },
      { id: 3, rank: 4000000 },
      { id: 4, rank: 5000000 },
    ]);
  });

  test("2 todonote, prioryty 3, test rerank on high adge  ", async () => {
    //arrnage
    const todos = [
      { id: 1, rank: 0 },
      { id: 4, rank: 2146483647 },
    ];
    const req = {
      params: {
        listid,
      },
      body: { ...todonote, priority: 5 },
    };
    const { text, done } = todonote;
    getTodosByListId.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolve(todos);
        })
    );
    //act
    await setTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(createTodos).toBeCalledWith(listid, [{ text, rank: 3000000, done }]);
    expect(updateTodos).toHaveBeenCalledWith([
      { id: 1, rank: 1000000 },
      { id: 4, rank: 2000000 },
    ]);
  });

  test("4 todonote, priority 4, rerank when no distance", async () => {
    //arrnage
    const priority = 4;
    const todos = [
      { id: 1, rank: 10 },
      { id: 2, rank: 1000 },
      { id: 3, rank: 1100 },
      { id: 4, rank: 1101 },
    ];

    const req = {
      params: {
        listid,
      },
      body: { ...todonote, priority },
    };

    getTodosByListId.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolve(todos);
        })
    );

    const { text, done } = todonote;
    //act
    await setTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(createTodos).toBeCalledWith(listid, [{ text, rank: 4000000, done }]);
    expect(updateTodos).toHaveBeenCalledWith([
      { id: 1, rank: 1000000 },
      { id: 2, rank: 2000000 },
      { id: 3, rank: 3000000 },
      { id: 4, rank: 5000000 },
    ]);
  });

  test("4 todonote, priority 3", async () => {
    //arrnage
    const todos = [
      { id: 1, rank: 0 },
      { id: 2, rank: 1 },
      { id: 3, rank: 3 },
      { id: 4, rank: 1300 },
    ];
    const req = {
      params: {
        listid,
      },
      body: { ...todonote, priority: 3 },
    };

    getTodosByListId.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolve(todos);
        })
    );

    const { text, done } = todonote;
    //act
    await setTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(createTodos).toBeCalledWith(listid, [{ text, rank: 2, done }]);
    expect(updateTodos).not.toHaveBeenCalled();
  });

  test("4 todonote, priority 1", async () => {
    //arrnage
    const todos = [
      { id: 1, rank: 10 },
      { id: 2, rank: 20 },
      { id: 3, rank: 33 },
      { id: 4, rank: 1300 },
    ];
    const req = {
      params: {
        listid,
      },
      body: { ...todonote, priority: 1 },
    };

    getTodosByListId.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolve(todos);
        })
    );

    const { text, done } = todonote;
    //act
    await setTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(createTodos).toBeCalledWith(listid, [{ text, rank: 5, done }]);
    expect(updateTodos).not.toHaveBeenCalled();
  });

  test("4 todonote, priority last", async () => {
    //arrnage
    const todos = [
      { id: 1, rank: 10 },
      { id: 2, rank: 20 },
      { id: 3, rank: 30 },
      { id: 4, rank: 40 },
    ];
    const req = {
      params: {
        listid,
      },
      body: { ...todonote, priority: 4 },
    };

    getTodosByListId.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolve(todos);
        })
    );

    const { text, done } = todonote;
    //act
    await setTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(createTodos).toBeCalledWith(listid, [{ text, rank: 35, done }]);
    expect(updateTodos).not.toHaveBeenCalled();
  });

  test("4 todonote, priority more then last", async () => {
    //arrnage
    const todos = [
      { id: 1, rank: 10 },
      { id: 2, rank: 20 },
      { id: 3, rank: 30 },
      { id: 4, rank: 40 },
    ];
    const req = {
      params: {
        listid,
      },
      body: { ...todonote, priority: 5 },
    };

    getTodosByListId.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolve(todos);
        })
    );

    const { text, done } = todonote;
    //act
    await setTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(createTodos).toBeCalledWith(listid, [{ text, rank: 1000040, done }]);
    expect(updateTodos).not.toHaveBeenCalled();
  });

  test("4 todonote, priority mach more then last", async () => {
    //arrnage
    const todos = [
      { id: 1, rank: 10 },
      { id: 2, rank: 20 },
      { id: 3, rank: 30 },
      { id: 4, rank: 40 },
    ];
    const req = {
      params: {
        listid,
      },
      body: { ...todonote, priority: 15 },
    };

    getTodosByListId.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolve(todos);
        })
    );

    const { text, done } = todonote;
    //act
    await setTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(createTodos).toBeCalledWith(listid, [{ text, rank: 1000040, done }]);
    expect(updateTodos).not.toHaveBeenCalled();
  });
});
