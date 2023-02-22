/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
      ALTER TABLE lists ALTER COLUMN updated_at SET DATA TYPE timestamp without time zone      `);
};

exports.down = (pgm) => {};
