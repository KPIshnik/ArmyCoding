jest.mock("../../../models/todilists/getTodosByListId");
jest.mock("../../../models/todilists/updateTodos");

const updateTodonoteController = require("../../../controllers/todolists/todonote/updateTodonoteController");
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
  id: "someid",
  text: "todonote",
  priority: 2,
  done: true,
  valid: true,
};
const id = "someid";
const listid = 1;

describe("updateTodonoteController", () => {
  beforeEach(() => {
    updateTodos.mockClear();
    res.status.mockClear();
  });

  test("mooving down. priority 2", async () => {
    //arrnage
    const todos = [
      { id: 1, rank: 1 },
      { id: 2, rank: 4 },
      { id: 3, rank: 6 },
      { ...todonote, rank: 7 },
      { id: 4, rank: 8 },
    ];
    const req = {
      params: {
        listid,
        id,
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
    await updateTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(updateTodos).toHaveBeenCalledWith([{ id, text, rank: 2, done }]);
  });

  test("mooving down. priority 1", async () => {
    //arrnage
    const todos = [
      { id: 1, rank: 10 },
      { id: 2, rank: 40 },
      { id: 3, rank: 60 },
      { ...todonote, rank: 70 },
      { id: 4, rank: 80 },
    ];
    const req = {
      params: {
        listid,
        id,
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
    await updateTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(updateTodos).toHaveBeenCalledWith([{ id, text, rank: 5, done }]);
  });

  test("mooving down. priority 2", async () => {
    //arrnage
    const todos = [
      { id: 1, rank: 10 },
      { id: 2, rank: 40 },
      { id: 3, rank: 60 },
      { ...todonote, rank: 70 },
      { id: 4, rank: 80 },
    ];
    const req = {
      params: {
        listid,
        id,
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
    await updateTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(updateTodos).toHaveBeenCalledWith([{ id, text, rank: 25, done }]);
  });

  test("mooving up. priority 4", async () => {
    //arrnage
    const todos = [
      { id: 1, rank: 1 },
      { ...todonote, rank: 2 },
      { id: 2, rank: 4 },
      { id: 3, rank: 6 },
      { id: 4, rank: 8 },
    ];
    const req = {
      params: {
        listid,
        id,
      },
      body: { ...todonote, priority: 4 },
    };

    const { text, done } = todonote;
    getTodosByListId.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolve(todos);
        })
    );
    //act
    await updateTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(updateTodos).toHaveBeenCalledWith([{ id, text, rank: 7, done }]);
  });

  test("mooving up. priority last", async () => {
    //arrnage
    const todos = [
      { id: 1, rank: 1 },
      { ...todonote, rank: 2 },
      { id: 2, rank: 4 },
      { id: 3, rank: 6 },
      { id: 4, rank: 8 },
    ];
    const req = {
      params: {
        listid,
        id,
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
    await updateTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(updateTodos).toHaveBeenCalledWith([
      { id, text, rank: 1000008, done },
    ]);
  });

  test("mooving up. priority more then last", async () => {
    //arrnage
    const todos = [
      { id: 1, rank: 1 },
      { ...todonote, rank: 2 },
      { id: 2, rank: 4 },
      { id: 3, rank: 6 },
      { id: 4, rank: 8 },
    ];
    const req = {
      params: {
        listid,
        id,
      },
      body: { ...todonote, priority: 100 },
    };

    const { text, done } = todonote;
    getTodosByListId.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolve(todos);
        })
    );
    //act
    await updateTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(updateTodos).toHaveBeenCalledWith([
      { id, text, rank: 1000008, done },
    ]);
  });

  test("not mooving ", async () => {
    //arrnage
    const todos = [
      { id: 1, rank: 1 },
      { ...todonote, rank: 2 },
      { id: 2, rank: 4 },
      { id: 3, rank: 6 },
      { id: 4, rank: 8 },
    ];
    const req = {
      params: {
        listid,
        id,
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
    await updateTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(updateTodos).toHaveBeenCalledWith([{ id, text, rank: 2, done }]);
  });

  test("not mooving, priority  1", async () => {
    //arrnage
    const todos = [
      { ...todonote, rank: 1 },
      { id: 1, rank: 3 },
      { id: 2, rank: 4 },
      { id: 3, rank: 6 },
      { id: 4, rank: 8 },
    ];
    const req = {
      params: {
        listid,
        id,
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
    await updateTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(updateTodos).toHaveBeenCalledWith([{ id, text, rank: 1, done }]);
  });

  test("not mooving. priority last", async () => {
    //arrnage
    const todos = [
      { id: 1, rank: 1 },
      { id: 2, rank: 4 },
      { id: 3, rank: 6 },
      { id: 4, rank: 8 },
      { ...todonote, rank: 10 },
    ];
    const req = {
      params: {
        listid,
        id,
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
    await updateTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(updateTodos).toHaveBeenCalledWith([{ id, text, rank: 10, done }]);
  });

  test("not mooving. priority more then last", async () => {
    //arrnage
    const todos = [
      { id: 1, rank: 1 },
      { id: 2, rank: 4 },
      { id: 3, rank: 6 },
      { id: 4, rank: 8 },
      { ...todonote, rank: 10 },
    ];
    const req = {
      params: {
        listid,
        id,
      },
      body: { ...todonote, priority: 15 },
    };

    const { text, done } = todonote;
    getTodosByListId.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolve(todos);
        })
    );
    //act
    await updateTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(updateTodos).toHaveBeenCalledWith([{ id, text, rank: 10, done }]);
  });

  test("mooving. 1 todonote, priority 1", async () => {
    //arrnage
    const todos = [{ ...todonote, rank: 70 }];
    const req = {
      params: {
        listid,
        id,
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
    await updateTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(updateTodos).toHaveBeenCalledWith([{ id, text, rank: 70, done }]);
  });

  test("mooving. 1 todonote, priority 4", async () => {
    //arrnage
    const todos = [{ ...todonote, rank: 70 }];
    const req = {
      params: {
        listid,
        id,
      },
      body: { ...todonote, priority: 4 },
    };

    const { text, done } = todonote;
    getTodosByListId.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolve(todos);
        })
    );
    //act
    await updateTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(updateTodos).toHaveBeenCalledWith([{ id, text, rank: 70, done }]);
  });

  test(" test rerank when on low adge ", async () => {
    //arrnage
    const todos = [
      { id: 1, rank: 1 },
      { id: 2, rank: 4 },
      { id: 3, rank: 6 },
      { id: 4, rank: 8 },
      { ...todonote, rank: 10 },
    ];

    const req = {
      params: {
        listid,
        id,
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
    await updateTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(updateTodos).toHaveBeenCalledWith([
      { listid, id, text, rank: 1000000, done },
      { id: 1, rank: 2000000 },
      { id: 2, rank: 3000000 },
      { id: 3, rank: 4000000 },
      { id: 4, rank: 5000000 },
    ]);
  });

  test(" test rerank when on high adge ", async () => {
    //arrnage
    const todos = [
      { id: 1, rank: 1 },
      { id: 2, rank: 4 },
      { id: 3, rank: 6 },
      { ...todonote, rank: 10 },
      { id: 4, rank: 2146483647 },
    ];

    const req = {
      params: {
        listid,
        id,
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
    await updateTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(updateTodos).toHaveBeenCalledWith([
      { id: 1, rank: 1000000 },
      { id: 2, rank: 2000000 },
      { id: 3, rank: 3000000 },
      { id: 4, rank: 4000000 },
      { listid, id, text, rank: 5000000, done },
    ]);
  });

  test(" rerank when no distance ", async () => {
    //arrnage
    const todos = [
      { id: 1, rank: 1 },
      { id: 2, rank: 4 },
      { id: 3, rank: 5 },
      { ...todonote, rank: 10 },
      { id: 4, rank: 15 },
    ];

    const req = {
      params: {
        listid,
        id,
      },
      body: { ...todonote, priority: 3 },
    };
    const { text, done } = todonote;
    getTodosByListId.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolve(todos);
        })
    );
    //act
    await updateTodonoteController(req, res, next);
    //assert
    expect(res.status).toBeCalledWith(200);
    expect(updateTodos).toHaveBeenCalledWith([
      { id: 1, rank: 1000000 },
      { id: 2, rank: 2000000 },
      { listid, id, text, rank: 3000000, done },
      { id: 3, rank: 4000000 },
      { id: 4, rank: 5000000 },
    ]);
  });
});
