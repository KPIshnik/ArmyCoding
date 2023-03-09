const pool = require("../DBconnection");

const deleteTodos = async (todosToDeleteIds) => {
  const res = await pool.query(
    "DELETE FROM todos where  id = any ($1) returning text",
    [todosToDeleteIds]
  );
  return res.rows;
};

module.exports = deleteTodos;
