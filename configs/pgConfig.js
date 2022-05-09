const pgConfig = {
  host: process.env.PGHOST || "localhost",
  user: process.env.PGUSER || "kpishnik",
  database: process.env.PGDATABASE || "list_api_first_try",
  password: process.env.PGPASSWORD || "123",
  port: process.env.PGPORT || "5432",
};

// const pgConfig = {
//   host: "tai.db.elephantsql.com",
//   port: "5432",
//   user: "erazuxgz",
//   password: "3JaSHchksDu891lZc9J0QhUJJWKT04gK",
//   database: "erazuxgz",
// };

module.exports = pgConfig;
