const { Pool } = require("pg");
const { pgConfig } = require("../configs/credentials");

const environment = process.argv[1];

const pool = new Pool(pgConfig[environment]);

module.exports = pool;
