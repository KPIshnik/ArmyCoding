const pool = require("../DBconnection");

const deleteTodos = async (todosToDeleteIds) => {
  await pool.query("DELETE FROM todos where  id = any ($1)", [
    todosToDeleteIds,
  ]);
};

module.exports = deleteTodos;
