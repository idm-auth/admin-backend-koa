import { getLogger } from '@/utils/localStorage.util';
import { Context } from 'koa';
import { RealmPaginatedResponse } from './realm.schema';
import * as realmService from './realm.service';
import * as realmMapper from './realm.mapper';

export const create = async (ctx: Context) => {
  const realm = await realmService.create(
    ctx.validated.body
  );

  ctx.status = 201;
  ctx.body = realmMapper.toCreateResponse(realm);
};

export const findById = async (ctx: Context) => {
  const { id } = ctx.validated.params;

  const realm = await realmService.findById(id);

  ctx.body = realmMapper.toReadResponse(realm);
};

export const findByPublicUUID = async (ctx: Context) => {
  const { publicUUID } = ctx.validated.params;

  const realm = await realmService.findByPublicUUID(publicUUID);

  ctx.body = realmMapper.toReadResponse(realm);
};

export const update = async (ctx: Context) => {
  const { id } = ctx.validated.params;
  const updateData = ctx.validated.body;

  const realm = await realmService.update(id, updateData);

  ctx.body = realmMapper.toUpdateResponse(realm);
};

export const findAllPaginated = async (ctx: Context) => {
  const logger = await getLogger();
  const query = ctx.validated.query;
  logger.debug({ query: JSON.stringify(query) }, 'findAllPaginated query:');
  const serviceResult = await realmService.findAllPaginated(query);

  const data = serviceResult.data.map(realmMapper.toListItemResponse);

  const result: RealmPaginatedResponse = {
    data,
    pagination: serviceResult.pagination,
  };

  ctx.body = result;
};

export const remove = async (ctx: Context) => {
  const { id } = ctx.validated.params;

  await realmService.remove(id);

  ctx.status = 204;
};
