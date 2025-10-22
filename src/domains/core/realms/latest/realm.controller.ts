import { getLogger } from '@/utils/localStorage.util';
import { Context } from 'koa';
import { RealmPaginatedResponse, RealmResponse } from './realm.schema';
import * as realmService from './realm.service';
import { Realm } from './realms.model';

export const create = async (ctx: Context) => {
  const realm = await realmService.create({
    data: ctx.validated.body,
  });

  ctx.status = 201;
  ctx.body = {
    _id: realm._id,
    name: realm.name,
    description: realm.description || undefined,
    publicUUID: realm.publicUUID,
    dbName: realm.dbName,
    jwtConfig: realm.jwtConfig,
    createdAt: realm.createdAt,
    updatedAt: realm.updatedAt,
    deletedAt: realm.deletedAt ? new Date(realm.deletedAt) : undefined,
  };
};

export const findById = async (ctx: Context) => {
  const { id } = ctx.validated.params;

  const realm = await realmService.findById({ id });

  ctx.body = {
    _id: realm._id,
    name: realm.name,
    description: realm.description || undefined,
    publicUUID: realm.publicUUID,
    dbName: realm.dbName,
    jwtConfig: realm.jwtConfig,
    createdAt: realm.createdAt,
    updatedAt: realm.updatedAt,
    deletedAt: realm.deletedAt ? new Date(realm.deletedAt) : undefined,
  };
};

export const findByPublicUUID = async (ctx: Context) => {
  const { publicUUID } = ctx.validated.params;

  const realm = await realmService.findByPublicUUID({
    publicUUID,
  });

  ctx.body = {
    _id: realm._id,
    name: realm.name,
    description: realm.description || undefined,
    publicUUID: realm.publicUUID,
    dbName: realm.dbName,
    jwtConfig: realm.jwtConfig,
    createdAt: realm.createdAt,
    updatedAt: realm.updatedAt,
    deletedAt: realm.deletedAt ? new Date(realm.deletedAt) : undefined,
  };
};

export const findByName = async (ctx: Context) => {
  const { name } = ctx.validated.query;

  const realm = await realmService.findByName({ name: name as string });

  ctx.body = {
    _id: realm._id,
    name: realm.name,
    description: realm.description || undefined,
    publicUUID: realm.publicUUID,
    dbName: realm.dbName,
    jwtConfig: realm.jwtConfig,
    createdAt: realm.createdAt,
    updatedAt: realm.updatedAt,
    deletedAt: realm.deletedAt ? new Date(realm.deletedAt) : undefined,
  };
};

export const update = async (ctx: Context) => {
  const { id } = ctx.validated.params;
  const updateData = ctx.validated.body;

  const realm = await realmService.update({ id, data: updateData });

  ctx.body = {
    _id: realm._id,
    name: realm.name,
    description: realm.description || undefined,
    publicUUID: realm.publicUUID,
    dbName: realm.dbName,
    jwtConfig: realm.jwtConfig,
    createdAt: realm.createdAt,
    updatedAt: realm.updatedAt,
    deletedAt: realm.deletedAt ? new Date(realm.deletedAt) : undefined,
  };
};

export const findAllPaginated = async (ctx: Context) => {
  const logger = await getLogger();
  const query = ctx.validated.query;
  logger.debug(query, 'findAllPaginated query:');
  const serviceResult = await realmService.findAllPaginated(query);

  const data: RealmResponse[] = serviceResult.data.map((realm: Realm) => ({
    _id: realm._id.toString(),
    name: realm.name,
    description: realm.description || undefined,
    publicUUID: realm.publicUUID,
    dbName: realm.dbName,
    jwtConfig: realm.jwtConfig,
    createdAt: realm.createdAt,
    updatedAt: realm.updatedAt,
    deletedAt: realm.deletedAt ? new Date(realm.deletedAt) : undefined,
  }));

  const result: RealmPaginatedResponse = {
    data,
    pagination: serviceResult.pagination,
  };

  ctx.body = result;
};

export const remove = async (ctx: Context) => {
  const { id } = ctx.validated.params;

  await realmService.remove({ id });

  ctx.status = 204;
};
