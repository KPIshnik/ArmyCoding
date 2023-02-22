/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE todos RENAME COLUMN priority TO rank;
    
    `);
};

exports.down = (pgm) => {};
