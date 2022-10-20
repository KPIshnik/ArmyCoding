/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(
    `CREATE TABLE IF NOT EXISTS users( 
     id         uuid         DEFAULT      gen_random_uuid() PRIMARY KEY,
     email      varchar(30)               UNIQUE,
     username   varchar(30)  NOT NUll     UNIQUE,
     password   varchar(30),
     googleid   varchar(50)               UNIQUE,
     facebookid varchar(50)               UNIQUE,
     auth_type  varchar(10)  NOT NULL
     );`
  );

  pgm.sql(
    `CREATE TABLE IF NOT EXISTS emailconfirm( 
    id         uuid,
    key        varchar      PRIMARY KEY,
    email      varchar(30)  NOT NUll,
    date       bigint,
    CONSTRAINT fk_userid
      FOREIGN KEY(id) 
	  REFERENCES users(id)
    );`
  );
};
exports.down = (pgm) => {
  pgm.sql(
    `DROP TABLE emailconfirm;
     DROP TABLE users;`
  );
};
