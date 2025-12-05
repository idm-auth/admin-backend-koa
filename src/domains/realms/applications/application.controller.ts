import { getLogger } from '@/utils/localStorage.util';
import { withSpanAsync } from '@/utils/tracing.util';
import { Context } from 'koa';
import * as applicationMapper from './application.mapper';
import { ApplicationPaginatedResponse } from './application.schema';
import * as applicationService from './application.service';

const CONTROLLER_NAME = 'application';

export const create = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.controller.create`,
      attributes: {
        'tenant.id': ctx.validated.params.tenantId,
        'application.systemId': ctx.validated.body?.systemId,
        'http.method': 'POST',
        controller: CONTROLLER_NAME,
      },
    },
    async () => {
      const logger = await getLogger();
      const { tenantId } = ctx.validated.params;

      logger.debug(
        { tenantId, body: ctx.validated.body },
        'Try create new application'
      );

      const application = await applicationService.create(
        tenantId,
        ctx.validated.body
      );
      const response = applicationMapper.toCreateResponse(application);

      logger.info(
        { tenantId, applicationId: application._id },
        'Application created successfully'
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
        'application.id': ctx.validated.params.id,
        'http.method': 'GET',
        controller: CONTROLLER_NAME,
      },
    },
    async () => {
      const { tenantId, id } = ctx.validated.params;

      const application = await applicationService.findById(tenantId, id);
      const response = applicationMapper.toCreateResponse(application);

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
        'application.id': ctx.validated.params.id,
        'http.method': 'PUT',
        controller: CONTROLLER_NAME,
      },
    },
    async () => {
      const logger = await getLogger();
      const { tenantId, id } = ctx.validated.params;
      const updateData = ctx.validated.body;

      try {
        const application = await applicationService.update(
          tenantId,
          id,
          updateData
        );

        logger.info(
          { tenantId, applicationId: id },
          'Application updated successfully'
        );

        ctx.body = applicationMapper.toUpdateResponse(application);
      } catch (error) {
        logger.error(
          { error, tenantId, applicationId: id },
          'Failed to update application'
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

      logger.debug({ tenantId, query }, 'Finding paginated applications');

      const serviceResult = await applicationService.findAllPaginated(
        tenantId,
        query
      );

      const data = serviceResult.data.map(applicationMapper.toListItemResponse);

      const result: ApplicationPaginatedResponse = {
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
        'Retrieved paginated applications'
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
        'application.id': ctx.validated.params.id,
        'http.method': 'DELETE',
        controller: CONTROLLER_NAME,
      },
    },
    async () => {
      const logger = await getLogger();
      const { tenantId, id } = ctx.validated.params;

      try {
        await applicationService.remove(tenantId, id);

        logger.info(
          { tenantId, applicationId: id },
          'Application removed successfully'
        );

        ctx.status = 204;
      } catch (error) {
        logger.error(
          { error, tenantId, applicationId: id },
          'Failed to remove application'
        );
        throw error;
      }
    }
  );
};
