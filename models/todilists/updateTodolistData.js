const pool = require("../../DB/db");

const updateTodolistData = async (listId, listname, date) => {
  await pool.query(
    "UPDATE lists SET listname = $2, updated_at= $3 WHERE id=$1;",
    [listId, listname, date]
  );
};

module.exports = updateTodolistData;
