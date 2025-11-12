import {
  RealmCreateResponse,
  RealmUpdateResponse,
  RealmListItemResponse,
} from './realm.schema';
import { Realm } from './realms.model';

const toBaseResponse = (realm: Realm) => ({
  _id: realm._id.toString(),
  name: realm.name,
  description: realm.description,
  publicUUID: realm.publicUUID,
  dbName: realm.dbName,
  jwtConfig: realm.jwtConfig,
});

export const toCreateResponse = (realm: Realm): RealmCreateResponse =>
  toBaseResponse(realm);

export const toUpdateResponse = (realm: Realm): RealmUpdateResponse =>
  toBaseResponse(realm);

export const toReadResponse = (realm: Realm): RealmCreateResponse =>
  toBaseResponse(realm);

export const toListItemResponse = (realm: Realm): RealmListItemResponse => ({
  _id: realm._id.toString(),
  name: realm.name,
  description: realm.description,
  publicUUID: realm.publicUUID,
});