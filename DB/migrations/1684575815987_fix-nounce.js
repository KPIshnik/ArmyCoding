/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`DROP TABLE nounce;`);

  pgm.sql(
    `CREATE TABLE IF NOT EXISTS nonce( 
               nonce              varchar(20)        PRIMARY KEY
               );`
  );
};
exports.down = (pgm) => {
  pgm.sql(`DROP TABLE nonce;`);
};
