import { getLogger } from '@/utils/localStorage.util';
import { withSpanAsync } from '@/utils/tracing.util';
import { Context } from 'koa';
import * as groupMapper from './group.mapper';
import { GroupPaginatedResponse } from './group.schema';
import * as groupService from './group.service';

const CONTROLLER_NAME = 'group';

export const create = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.controller.create`,
      attributes: {
        'tenant.id': ctx.validated.params.tenantId,
        'group.name': ctx.validated.body?.name,
        'http.method': 'POST',
        controller: CONTROLLER_NAME,
      },
    },
    async () => {
      const logger = await getLogger();
      const { tenantId } = ctx.validated.params;

      logger.debug(
        { tenantId, body: ctx.validated.body },
        'Try create new group'
      );

      const group = await groupService.create(tenantId, ctx.validated.body);
      const response = groupMapper.toCreateResponse(group);

      logger.info(
        { tenantId, groupId: group._id },
        'Group created successfully'
      );

      ctx.status = 201;
      ctx.body = response;
    }
  );
};

export const findById = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.controller.findById`,
      attributes: {
        'tenant.id': ctx.validated.params.tenantId,
        'group.id': ctx.validated.params.id,
        'http.method': 'GET',
        controller: CONTROLLER_NAME,
      },
    },
    async () => {
      const { tenantId, id } = ctx.validated.params;

      const group = await groupService.findById(tenantId, id);
      const response = groupMapper.toCreateResponse(group);

      ctx.body = response;
    }
  );
};

export const update = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.controller.update`,
      attributes: {
        'tenant.id': ctx.validated.params.tenantId,
        'group.id': ctx.validated.params.id,
        'http.method': 'PUT',
        controller: CONTROLLER_NAME,
      },
    },
    async () => {
      const logger = await getLogger();
      const { tenantId, id } = ctx.validated.params;
      const updateData = ctx.validated.body;

      try {
        const group = await groupService.update(tenantId, id, updateData);

        logger.info({ tenantId, groupId: id }, 'Group updated successfully');

        ctx.body = groupMapper.toUpdateResponse(group);
      } catch (error) {
        logger.error(
          { error, tenantId, groupId: id },
          'Failed to update group'
        );
        throw error;
      }
    }
  );
};

export const findAllPaginated = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.controller.findAllPaginated`,
      attributes: {
        'tenant.id': ctx.validated.params.tenantId,
        'http.method': 'GET',
        controller: CONTROLLER_NAME,
        operation: 'findAllPaginated',
      },
    },
    async (span) => {
      const logger = await getLogger();
      const { tenantId } = ctx.validated.params;
      const query = ctx.validated.query;

      logger.debug({ tenantId, query }, 'Finding paginated groups');

      const serviceResult = await groupService.findAllPaginated(
        tenantId,
        query
      );

      const data = serviceResult.data.map(groupMapper.toListItemResponse);

      const result: GroupPaginatedResponse = {
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
        'Retrieved paginated groups'
      );

      ctx.body = result;
    }
  );
};

export const remove = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.controller.remove`,
      attributes: {
        'tenant.id': ctx.validated.params.tenantId,
        'group.id': ctx.validated.params.id,
        'http.method': 'DELETE',
        controller: CONTROLLER_NAME,
      },
    },
    async () => {
      const logger = await getLogger();
      const { tenantId, id } = ctx.validated.params;

      try {
        await groupService.remove(tenantId, id);

        logger.info({ tenantId, groupId: id }, 'Group removed successfully');

        ctx.status = 204;
      } catch (error) {
        logger.error(
          { error, tenantId, groupId: id },
          'Failed to remove group'
        );
        throw error;
      }
    }
  );
};
