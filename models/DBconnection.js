const { Pool } = require("pg");
const config = require("../configs/pgConfig");

const pool = new Pool(config);

module.exports = pool;
