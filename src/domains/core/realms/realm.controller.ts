import { Context } from 'koa';
import { RealmPaginatedResponse } from './realm.schema';
import * as realmService from './realm.service';
import * as realmMapper from './realm.mapper';
import { withSpanAsync } from '@/utils/tracing.util';

const CONTROLLER_NAME = 'realm.controller';

export const create = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.create`,
      attributes: {
        operation: 'create',
        'http.method': 'POST',
      },
    },
    async () => {
      const realm = await realmService.create(ctx.validated.body);

      ctx.status = 201;
      ctx.body = realmMapper.toCreateResponse(realm);
    }
  );
};

export const findById = async (ctx: Context) => {
  const { id } = ctx.validated.params;

  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.findById`,
      attributes: {
        'realm.id': id,
        operation: 'findById',
        'http.method': 'GET',
      },
    },
    async () => {
      const realm = await realmService.findById(id);

      ctx.body = realmMapper.toReadResponse(realm);
    }
  );
};

export const findByPublicUUID = async (ctx: Context) => {
  const { publicUUID } = ctx.validated.params;

  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.findByPublicUUID`,
      attributes: {
        'realm.publicUUID': publicUUID,
        operation: 'findByPublicUUID',
        'http.method': 'GET',
      },
    },
    async () => {
      const realm = await realmService.findByPublicUUID(publicUUID);

      ctx.body = realmMapper.toReadResponse(realm);
    }
  );
};

export const update = async (ctx: Context) => {
  const { id } = ctx.validated.params;
  const updateData = ctx.validated.body;

  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.update`,
      attributes: {
        'realm.id': id,
        operation: 'update',
        'http.method': 'PUT',
      },
    },
    async () => {
      const realm = await realmService.update(id, updateData);

      ctx.body = realmMapper.toUpdateResponse(realm);
    }
  );
};

export const findAllPaginated = async (ctx: Context) => {
  const query = ctx.validated.query;

  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.findAllPaginated`,
      attributes: {
        operation: 'findAllPaginated',
        'http.method': 'GET',
        'pagination.page': query.page,
        'pagination.limit': query.limit,
      },
    },
    async () => {
      const serviceResult = await realmService.findAllPaginated(query);

      const data = serviceResult.data.map(realmMapper.toListItemResponse);

      const result: RealmPaginatedResponse = {
        data,
        pagination: serviceResult.pagination,
      };

      ctx.body = result;
    }
  );
};

export const remove = async (ctx: Context) => {
  const { id } = ctx.validated.params;

  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.remove`,
      attributes: {
        'realm.id': id,
        operation: 'remove',
        'http.method': 'DELETE',
      },
    },
    async () => {
      await realmService.remove(id);

      ctx.status = 204;
    }
  );
};
