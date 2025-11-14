import {
  RealmCreateResponse,
  RealmUpdateResponse,
  RealmListItemResponse,
} from './realm.schema';
import { Realm } from './realms.model';
import { withSpan } from '@/utils/tracing.util';

const MAPPER_NAME = 'realm.mapper';

const toBaseResponse = (realm: Realm) =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toBaseResponse`,
      attributes: {
        'realm.id': realm._id.toString(),
        operation: 'toBaseResponse',
      },
    },
    () => ({
      _id: realm._id.toString(),
      name: realm.name,
      description: realm.description,
      publicUUID: realm.publicUUID,
      dbName: realm.dbName,
      jwtConfig: realm.jwtConfig,
    })
  );

export const toCreateResponse = (realm: Realm): RealmCreateResponse =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toCreateResponse`,
      attributes: {
        'realm.id': realm._id.toString(),
        operation: 'toCreateResponse',
      },
    },
    () => toBaseResponse(realm)
  );

export const toUpdateResponse = (realm: Realm): RealmUpdateResponse =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toUpdateResponse`,
      attributes: {
        'realm.id': realm._id.toString(),
        operation: 'toUpdateResponse',
      },
    },
    () => toBaseResponse(realm)
  );

export const toReadResponse = (realm: Realm): RealmCreateResponse =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toReadResponse`,
      attributes: {
        'realm.id': realm._id.toString(),
        operation: 'toReadResponse',
      },
    },
    () => toBaseResponse(realm)
  );

export const toListItemResponse = (realm: Realm): RealmListItemResponse =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toListItemResponse`,
      attributes: {
        'realm.id': realm._id.toString(),
        operation: 'toListItemResponse',
      },
    },
    () => ({
      _id: realm._id.toString(),
      name: realm.name,
      description: realm.description,
      publicUUID: realm.publicUUID,
    })
  );
