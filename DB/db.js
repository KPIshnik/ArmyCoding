const { Pool } = require("pg");
const { db_config } = require("../configs/credentials");

const environment = process.env.NODE_ENV || "dev";

const pool = new Pool(db_config[environment]);

module.exports = pool;
