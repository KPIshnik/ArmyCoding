const pool = require("../models/DBconnection");

// pool
//   .query(
//     `INSERT INTO test(id, name, email ) VALUES
//   ('5bc8db26-ba8f-11ed-afa1-0242ac120002', 'j', 'j'),
// ('5bc8dd88-ba8f-11ed-afa1-0242ac120002', 's', 's'),
// ('5bc8dffe-ba8f-11ed-afa1-0242ac120002', 'z', 'z'),
// ('5bc8d4aa-ba8f-11ed-afa1-0242ac120002', 'k', 'k')
//  ;`
//   )
//   .then((x) => {
//     pool.end();
//   });

// const u1 = "5bc8dd88-ba8f-11ed-afa1-0242ac120002";
// const u2 = "5bc8dffe-ba8f-11ed-afa1-0242ac120002";

// pool
//   .query(
//     `update test as t set
// name = t2.name,
// email = t2.email
// from (values
//   ( $1, $2 ,$3),
//   ( $4, $5 ,$6),
//   ( $7, $8 ,$9)
// ) as t2(id, name, email)
// where t2.id = t.id::text `,
//     [
//       "5bc8db26-ba8f-11ed-afa1-0242ac120002",
//       "qqq",
//       "qq",
//       "5bc8dd88-ba8f-11ed-afa1-0242ac120002",
//       "aaa",
//       "aa",
//       "5bc8dffe-ba8f-11ed-afa1-0242ac120002",
//       "zzz",
//       "zz",
//     ]
//   )
//   .then((x) => {
//     pool.end();
//   });

pool
  .query(
    `update todos as t set 
text = t2.text, 
rank = t2.rank::int, 
done = t2.done::boolean 
from (values
( $1, $2, $3, $4 ),
( $5, $6, $7, $8 ),
( $9, $10, $11, $12 )) as t2(list_id, text, rank, done ) where t2.list_id = t.list_id::text`,
    [
      "30c3edf7-bbf1-4d9d-9e3d-fe599df52c3c",
      "AAAAAAAA",
      0,
      false,
      "33a0a6e8-a68a-4c2a-a07d-309be72822d5",
      "try",
      1000000,
      true,
      "c32ee148-d9e9-47d9-b2a1-27b4429926c2",
      "teo",
      2000000,
      true,
    ]
  )
  .then((d) => pool.end());
