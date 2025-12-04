import { DocId } from '@/domains/commons/base/base.schema';
import {
  PaginatedResponse,
  PaginationQuery,
} from '@/domains/commons/base/pagination.schema';
import { getDBName } from '@/domains/core/realms/realm.service';
import { NotFoundError } from '@/errors/not-found';
import { getLogger } from '@/utils/localStorage.util';
import { withSpanAsync } from '@/utils/tracing.util';
import { executePagination } from '@/utils/pagination.util';
import { v4 as uuidv4 } from 'uuid';
import { Application, getModel } from './application.model';
import { ApplicationCreate, ApplicationUpdate } from './application.schema';
import * as applicationRegistryService from '@/domains/core/application-registries/application-registry.service';

const SERVICE_NAME = 'application';

export const create = async (
  tenantId: string,
  data: ApplicationCreate
): Promise<{ application: Application; applicationKey: string }> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.create`,
      attributes: {
        'tenant.id': tenantId,
        'application.name': data.name,
        operation: 'create',
      },
    },
    async (span) => {
      const logger = await getLogger();

      logger.info({ tenantId, name: data.name }, 'Creating new application');

      const dbName = await getDBName({ publicUUID: tenantId });

      const application = await getModel(dbName).create({
        name: data.name,
        applicationSecret: uuidv4(),
      });

      span.setAttributes({
        'application.id': application._id,
        'db.name': dbName,
      });

      const registry = await applicationRegistryService.create({
        tenantId,
        applicationId: application._id,
      });

      logger.info(
        {
          applicationId: application._id,
          tenantId,
          applicationKey: registry.applicationKey,
        },
        'Application created successfully'
      );

      return { application, applicationKey: registry.applicationKey };
    }
  );
};

export const findById = async (
  tenantId: string,
  id: DocId
): Promise<{ application: Application; applicationKey: string }> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.findById`,
      attributes: {
        'tenant.id': tenantId,
        'application.id': id,
        operation: 'findById',
      },
    },
    async (span) => {
      const logger = await getLogger();

      logger.info({ tenantId, id }, 'Finding application by ID');

      const dbName = await getDBName({ publicUUID: tenantId });
      const application = await getModel(dbName).findById(id);

      if (!application) {
        logger.warn({ tenantId, id }, 'Application not found');
        throw new NotFoundError('Application not found');
      }

      const registry =
        await applicationRegistryService.findByApplicationIdAndTenantId(
          application._id,
          tenantId
        );

      span.setAttributes({ 'db.name': dbName });
      logger.info(
        { applicationId: application._id, tenantId },
        'Application found successfully'
      );

      return { application, applicationKey: registry.applicationKey };
    }
  );
};

export const update = async (
  tenantId: string,
  id: DocId,
  data: ApplicationUpdate
): Promise<{ application: Application; applicationKey: string }> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.update`,
      attributes: {
        'tenant.id': tenantId,
        'application.id': id,
        operation: 'update',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info({ tenantId, id }, 'Updating application');

      const result = await findById(tenantId, id);
      const application = result.application;

      if (data.name !== undefined) {
        application.name = data.name;
      }

      const updatedApplication = await application.save();

      span.setAttributes({ 'application.id': updatedApplication._id });
      logger.info(
        { applicationId: updatedApplication._id, tenantId },
        'Application updated successfully'
      );
      return {
        application: updatedApplication,
        applicationKey: result.applicationKey,
      };
    }
  );
};

export const remove = async (tenantId: string, id: DocId): Promise<void> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.remove`,
      attributes: {
        'tenant.id': tenantId,
        'application.id': id,
        operation: 'remove',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info({ tenantId, id }, 'Deleting application');

      const dbName = await getDBName({ publicUUID: tenantId });
      const result = await getModel(dbName).findByIdAndDelete(id);
      if (!result) {
        logger.warn({ tenantId, id }, 'Application not found for deletion');
        throw new NotFoundError('Application not found');
      }

      const registry =
        await applicationRegistryService.findByApplicationIdAndTenantId(
          id,
          tenantId
        );
      await applicationRegistryService.remove(registry._id);

      span.setAttributes({ 'db.name': dbName });
      logger.info({ tenantId, id }, 'Application deleted successfully');
    }
  );
};

export const findAllPaginated = async (
  tenantId: string,
  query: PaginationQuery
): Promise<
  PaginatedResponse<{ application: Application; applicationKey: string }>
> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.findAllPaginated`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'findAllPaginated',
        'pagination.page': query.page,
        'pagination.limit': query.limit,
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info({ tenantId, query }, 'Finding applications with pagination');

      const dbName = await getDBName({ publicUUID: tenantId });
      span.setAttributes({ 'db.name': dbName });

      const result = await executePagination(
        {
          model: getModel(dbName),
          query,
          defaultSortField: 'name',
          span,
        },
        (sanitizedFilter: string) => ({
          $or: [
            { name: { $regex: sanitizedFilter, $options: 'i' } },
            { _id: { $regex: sanitizedFilter, $options: 'i' } },
          ],
        })
      );

      const dataWithKeys = await Promise.all(
        result.data.map(async (app) => {
          const registry =
            await applicationRegistryService.findByApplicationIdAndTenantId(
              app._id,
              tenantId
            );
          return { application: app, applicationKey: registry.applicationKey };
        })
      );

      logger.info(
        {
          tenantId,
          total: result.pagination.total,
          page: result.pagination.page,
        },
        'Applications pagination completed successfully'
      );

      return { ...result, data: dataWithKeys };
    }
  );
};
