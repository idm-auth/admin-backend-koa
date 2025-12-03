import { Context } from 'koa';
import { withSpanAsync } from '@/utils/tracing.util';
import * as applicationRegistryService from './application-registry.service';
import * as applicationRegistryMapper from './application-registry.mapper';
import { ApplicationRegistryPaginatedResponse } from './application-registry.schema';

const CONTROLLER_NAME = 'application-registry';

export const create = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.controller.create`,
      attributes: {
        operation: 'create',
        'http.method': 'POST',
      },
    },
    async () => {
      const registry = await applicationRegistryService.create(
        ctx.validated.body
      );

      ctx.status = 201;
      ctx.body = applicationRegistryMapper.toCreateResponse(registry);
    }
  );
};

export const findById = async (ctx: Context) => {
  const { id } = ctx.validated.params;

  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.controller.findById`,
      attributes: {
        'application-registry.id': id,
        operation: 'findById',
        'http.method': 'GET',
      },
    },
    async () => {
      const registry = await applicationRegistryService.findById(id);

      ctx.body = applicationRegistryMapper.toCreateResponse(registry);
    }
  );
};

export const findByApplicationKey = async (ctx: Context) => {
  const { applicationKey } = ctx.validated.params;

  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.controller.findByApplicationKey`,
      attributes: {
        'application-registry.applicationKey': applicationKey,
        operation: 'findByApplicationKey',
        'http.method': 'GET',
      },
    },
    async () => {
      const registry =
        await applicationRegistryService.findByApplicationKey(applicationKey);

      ctx.body = applicationRegistryMapper.toCreateResponse(registry);
    }
  );
};

export const update = async (ctx: Context) => {
  const { id } = ctx.validated.params;
  const updateData = ctx.validated.body;

  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.controller.update`,
      attributes: {
        'application-registry.id': id,
        operation: 'update',
        'http.method': 'PUT',
      },
    },
    async () => {
      const registry = await applicationRegistryService.update(id, updateData);

      ctx.body = applicationRegistryMapper.toUpdateResponse(registry);
    }
  );
};

export const findAllPaginated = async (ctx: Context) => {
  const query = ctx.validated.query;

  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.controller.findAllPaginated`,
      attributes: {
        operation: 'findAllPaginated',
        'http.method': 'GET',
        'pagination.page': query.page,
        'pagination.limit': query.limit,
      },
    },
    async () => {
      const serviceResult =
        await applicationRegistryService.findAllPaginated(query);

      const data = serviceResult.data.map(
        applicationRegistryMapper.toListItemResponse
      );

      const result: ApplicationRegistryPaginatedResponse = {
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
      name: `${CONTROLLER_NAME}.controller.remove`,
      attributes: {
        'application-registry.id': id,
        operation: 'remove',
        'http.method': 'DELETE',
      },
    },
    async () => {
      await applicationRegistryService.remove(id);

      ctx.status = 204;
    }
  );
};
