const pool = require("../DBconnection");

const getTodonoteById = async (id) => {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT * FROM todos WHERE (id= $1)", [id]);
    return res.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = getTodonoteById;
