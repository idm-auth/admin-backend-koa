import {
  RealmCreateResponse,
  RealmUpdateResponse,
  RealmListItemResponse,
} from './realm.schema';
import { Realm } from './realms.model';

export const toCreateResponse = (realm: Realm): RealmCreateResponse => ({
  _id: realm._id.toString(),
  name: realm.name,
  description: realm.description,
  publicUUID: realm.publicUUID,
  dbName: realm.dbName,
  jwtConfig: realm.jwtConfig,
});

export const toUpdateResponse = (realm: Realm): RealmUpdateResponse => ({
  _id: realm._id.toString(),
  name: realm.name,
  description: realm.description,
  publicUUID: realm.publicUUID,
  dbName: realm.dbName,
  jwtConfig: realm.jwtConfig,
});

export const toListItemResponse = (realm: Realm): RealmListItemResponse => ({
  _id: realm._id.toString(),
  name: realm.name,
  description: realm.description,
  publicUUID: realm.publicUUID,
});