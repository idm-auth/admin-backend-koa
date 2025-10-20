import { validateZod } from '@/domains/commons/validations/latest/validation.service';
import { Context } from 'koa';
import { realmListQuerySchema, RealmPaginatedResponse } from './realm.schema';
import * as realmService from './realm.service';
import { getLogger } from '@/utils/localStorage.util';

export const create = async (ctx: Context) => {
  const { name, dbName, jwtConfig } = ctx.request.body;

  const realm = await realmService.create({
    data: { name, dbName, jwtConfig },
  });

  ctx.status = 201;
  ctx.body = {
    _id: realm._id,
    name: realm.name,
    publicUUID: realm.publicUUID,
    dbName: realm.dbName,
  };
};

export const findById = async (ctx: Context) => {
  const { id } = ctx.params;

  const realm = await realmService.findById({ id });

  ctx.body = {
    _id: realm._id,
    name: realm.name,
    publicUUID: realm.publicUUID,
    dbName: realm.dbName,
  };
};

export const findByPublicUUID = async (ctx: Context) => {
  const { publicUUID } = ctx.params;

  const realm = await realmService.findByPublicUUID({
    publicUUID,
  });

  ctx.body = {
    _id: realm._id,
    name: realm.name,
    publicUUID: realm.publicUUID,
    dbName: realm.dbName,
  };
};

export const findByName = async (ctx: Context) => {
  const { name } = ctx.query;

  const realm = await realmService.findByName({ name: name as string });

  ctx.body = {
    _id: realm._id,
    name: realm.name,
    publicUUID: realm.publicUUID,
    dbName: realm.dbName,
  };
};

export const update = async (ctx: Context) => {
  const { id } = ctx.params;
  const updateData = ctx.request.body;

  const realm = await realmService.update({ id, data: updateData });

  ctx.body = {
    _id: realm._id,
    name: realm.name,
    publicUUID: realm.publicUUID,
    dbName: realm.dbName,
  };
};

export const findAllPaginated = async (ctx: Context) => {
  const logger = await getLogger();
  const query = ctx.query;
  logger.debug(query, 'findAllPaginated query:');
  const validatedQuery = await validateZod(query, realmListQuerySchema);
  const serviceResult = await realmService.findAllPaginated(validatedQuery);

  const result: RealmPaginatedResponse = {
    data: serviceResult.data.map((realm) => ({
      _id: realm._id,
      name: realm.name,
      description: realm.description || undefined,
      publicUUID: realm.publicUUID,
      dbName: realm.dbName,
      jwtConfig: realm.jwtConfig,
      createdAt: realm.createdAt,
      updatedAt: realm.updatedAt,
      deletedAt: realm.deletedAt ? new Date(realm.deletedAt) : undefined,
    })),
    pagination: serviceResult.pagination,
  };

  ctx.body = result;
};

export const remove = async (ctx: Context) => {
  const { id } = ctx.params;

  await realmService.remove({ id });

  ctx.status = 204;
};
