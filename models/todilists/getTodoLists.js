const pool = require("../DBconnection");

const getTodoListS = async (id) => {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT * FROM lists WHERE owner_id = $1", [
      id,
    ]);
    return res.rows;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = getTodoListS;
