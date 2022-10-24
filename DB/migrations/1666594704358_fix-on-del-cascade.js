/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(` ALTER TABLE emailconfirm DROP CONSTRAINT fk_userid;
              ALTER TABLE emailconfirm ADD CONSTRAINT fk_userid
              FOREIGN KEY (id)
              REFERENCES users(id)
              ON DELETE cascade;
              
     `);
};

exports.down = (pgm) => {};
