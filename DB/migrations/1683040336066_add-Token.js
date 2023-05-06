/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(
    `CREATE TABLE IF NOT EXISTS refreshtokens( 
       userid              uuid          REFERENCES users(id) ON DELETE cascade,
       refreshtoken        varchar(20)   UNIQUE NOT NULL,
       deviceid            varchar(20)   PRIMARY KEY
       );`
  );
};
exports.down = (pgm) => {
  pgm.sql(`DROP TABLE refreshtokens;`);
};
