/* eslint-disable camelcase */

exports.shorthands = undefined;
exports.up = (pgm) => {
  pgm.sql(
    `CREATE TABLE IF NOT EXISTS todos(
     id         uuid         DEFAULT      gen_random_uuid() PRIMARY KEY, 
     list_id    uuid  REFERENCES lists(id) ON DELETE cascade,
     text       varchar(200),
     priority   int,
     done       bool
    );`
  );
};
exports.down = (pgm) => {
  pgm.sql(`DROP TABLE todos;`);
};
