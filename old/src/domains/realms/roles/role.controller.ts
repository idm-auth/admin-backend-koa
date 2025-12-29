import * as roleService from './role.service';
import * as roleMapper from './role.mapper';
import { Context } from 'koa';
import { withSpanAsync } from '@/utils/tracing.util';
import { RolePaginatedResponse } from './role.schema';
import { getLogger } from '@/utils/localStorage.util';

const CONTROLLER_NAME = 'role.controller';

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
      const { tenantId } = ctx.validated.params;
      const { name, description, permissions } = ctx.validated.body;

      const role = await roleService.create(tenantId, {
        name,
        description,
        permissions,
      });

      ctx.status = 201;
      ctx.body = roleMapper.toResponse(role);
    }
  );
};

export const findById = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.findById`,
      attributes: {
        operation: 'findById',
        'http.method': 'GET',
      },
    },
    async () => {
      const { tenantId, id } = ctx.validated.params;

      const role = await roleService.findById(tenantId, id);

      ctx.body = roleMapper.toResponse(role);
    }
  );
};

export const update = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.update`,
      attributes: {
        operation: 'update',
        'http.method': 'PUT',
      },
    },
    async () => {
      const { tenantId, id } = ctx.validated.params;
      const { name, description, permissions } = ctx.validated.body;

      const role = await roleService.update(tenantId, id, {
        name,
        description,
        permissions,
      });

      ctx.body = roleMapper.toResponse(role);
    }
  );
};

export const remove = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.remove`,
      attributes: {
        operation: 'remove',
        'http.method': 'DELETE',
      },
    },
    async () => {
      const { tenantId, id } = ctx.validated.params;

      await roleService.remove(tenantId, id);

      ctx.status = 204;
    }
  );
};

export const findAllPaginated = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.findAllPaginated`,
      attributes: {
        operation: 'findAllPaginated',
        'http.method': 'GET',
      },
    },
    async (span) => {
      const logger = await getLogger();
      const { tenantId } = ctx.validated.params;
      const query = ctx.validated.query;

      logger.debug({ tenantId, query }, 'Finding paginated roles');

      const serviceResult = await roleService.findAllPaginated(tenantId, query);

      const data = serviceResult.data.map(roleMapper.toListItemResponse);

      const result: RolePaginatedResponse = {
        data,
        pagination: serviceResult.pagination,
      };

      span.setAttributes({
        'result.total': serviceResult.pagination.total,
        'result.page': serviceResult.pagination.page,
        'result.totalPages': serviceResult.pagination.totalPages,
      });

      logger.debug(
        { tenantId, total: serviceResult.pagination.total },
        'Retrieved paginated roles'
      );

      ctx.body = result;
    }
  );
};
