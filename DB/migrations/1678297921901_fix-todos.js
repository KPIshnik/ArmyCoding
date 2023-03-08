/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
      ALTER TABLE todos RENAME COLUMN list_id TO listId;
      `);
};

exports.down = (pgm) => {};
