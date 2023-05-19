const { Pool } = require("pg");
const { db_conection } = require("../configs/config");

const environment = process.env.NODE_ENV || "dev";

const db = new Pool(db_conection[environment]);

module.exports = db;
