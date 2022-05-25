const { Pool } = require("pg");
const { pgConfig } = require("../configs/credentials")

const pool = new Pool(pgConfig);

module.exports = pool;
