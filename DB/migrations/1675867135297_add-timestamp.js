/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(
    `ALTER TABLE lists
     ADD COLUMN updated_at timestamp;`
  );
};
exports.down = (pgm) => {
  pgm.sql(`ALTER TABLE lists
  DROP COLUMN updated_at;`);
};

exports.down = (pgm) => {};
