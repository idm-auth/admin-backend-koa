const databaseAdmin = 'admin';
const database = 'idm-core-db';
const collection = 'realms';
const user = 'mongoose';
const pwd = 'mongoose';
use(database);
db.createCollection(collection);

use(databaseAdmin);
db.createUser({
  user: user,
  pwd: pwd,
  roles: ['readWriteAnyDatabase'],
});

// const databaseSingleTenant = 'singleTenant';
// const collectionSingleTenant = 'singleTenant';
// const userSingleTenant = 'singleTenant';
// const pwdSingleTenant = 'singleTenant';
// use(databaseSingleTenant);
// db.createCollection(collectionSingleTenant);

// db.createUser({
//   user: userSingleTenant,
//   pwd: pwdSingleTenant,
//   roles: [{ role: 'readWrite', db: databaseSingleTenant }],
// });

// const databaseMultiTenant = 'multiTenant';
// const collectionMultiTenant = 'multiTenant';
// const userMultiTenant = 'multiTenant';
// const pwdMultiTenant = 'multiTenant';
// use(databaseMultiTenant);
// db.createCollection(collectionMultiTenant);

// use(databaseAdmin);
// db.createUser({
//   user: userMultiTenant,
//   pwd: pwdMultiTenant,
//   roles: ['readWriteAnyDatabase'],
// });
