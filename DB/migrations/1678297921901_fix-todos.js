/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
      ALTER TABLE todos RENAME COLUMN list_id TO listid;
      `);
};

exports.down = (pgm) => {};
