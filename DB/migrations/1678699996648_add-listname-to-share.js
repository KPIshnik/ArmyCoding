/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`ALTER TABLE lists_sharing_table ADD COLUMN listname varchar;`);
};

exports.down = (pgm) => {};
