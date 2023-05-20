/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(
    `CREATE TABLE IF NOT EXISTS nounce( 
             nounce              varchar(20)        PRIMARY KEY
             );`
  );
};
exports.down = (pgm) => {
  pgm.sql(`DROP TABLE nounce;`);
};
