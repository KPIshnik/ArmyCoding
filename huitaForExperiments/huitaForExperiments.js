const uuidValidaor = require("../helpers/uuidValidator");
const pool = require("../models/DBconnection");

// /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89AB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i

// createTodoList("d3aa88e2-c754-41e0-8ba6-4198a34aa0a2")

console.log(uuidValidaor("d3aa8-c754-41e0-8ba6-4198a34aa0a2"));
