const databaseAdmin = 'admin';
const database = 'mongoose';
const collection = 'mongoose';
const user = 'mongoose';
const pwd = 'mongoose';
use(database);
db.createCollection(collection);

db.createUser({
  user: user,
  pwd: pwd,
  roles: [{ role: 'readWrite', db: database }],
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
