/* eslint-disable camelcase */

exports.shorthands = undefined;
exports.up = (pgm) => {
  pgm.sql(
    `CREATE TABLE IF NOT EXISTS lists( 
     id         uuid         DEFAULT      gen_random_uuid() PRIMARY KEY,
     owner_id   uuid, 
     listname   varchar(30)  NOT NULL,        
      CONSTRAINT fk_owner_id
        FOREIGN KEY(owner_id) 
          REFERENCES users(id)
          ON DELETE cascade
     );`
  );

  pgm.sql(
    `CREATE TABLE IF NOT EXISTS lists_sharing_table( 
     userid    uuid  REFERENCES users(id) ON DELETE cascade,
     listid    uuid  REFERENCES lists(id) ON DELETE cascade
     );`
  );
};
exports.down = (pgm) => {
  pgm.sql(
    `DROP TABLE lists_sharing_table;
     DROP TABLE lists;`
  );
};
