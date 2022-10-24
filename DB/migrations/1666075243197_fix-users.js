/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE users ALTER COLUMN password SET DATA TYPE varchar(70)
    `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE users ALTER COLUMN password SET DATA TYPE varchar(70)
    `);
};
