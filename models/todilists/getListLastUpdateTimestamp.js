const pool = require("../DBconnection");

const getListLastUpdateTimestamp = async (listId) => {
  const client = await pool.connect();
  try {
    const res = await client.query(
      "SELECT updated_at FROM lists WHERE id = $1",
      [listId]
    );
    return res.rows[0].updated_at;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = getListLastUpdateTimestamp;
