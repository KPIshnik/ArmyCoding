/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE users ALTER COLUMN email SET DATA TYPE varchar(70);
    ALTER TABLE emailconfirm ALTER COLUMN email SET DATA TYPE varchar(70)
    `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE users ALTER COLUMN email SET DATA TYPE varchar(70)
    `);
};
