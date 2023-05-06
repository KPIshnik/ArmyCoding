const db = require("../../DB/db");

const deleteDeviceId = async (deviceid) => {
  const res = await db.query("DELETE FROM refreshtokens where deviceid = $1", [
    deviceid,
  ]);
  return res.rows[0] ? res.rows[0].refreshtoken : undefined;
};

module.exports = deleteDeviceId;
