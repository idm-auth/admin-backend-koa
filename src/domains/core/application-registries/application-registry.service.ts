import {
  PaginatedResponse,
  PaginationQuery,
} from '@/domains/commons/base/pagination.schema';
import { DocId } from '@/domains/commons/base/base.schema';
import { NotFoundError } from '@/errors/not-found';
import { ConflictError } from '@/errors/conflict';
import { getLogger } from '@/utils/localStorage.util';
import { withSpanAsync } from '@/utils/tracing.util';
import { executePagination } from '@/utils/pagination.util';
import {
  ApplicationRegistry,
  ApplicationRegistryCreate,
  getModel,
} from './application-registry.model';

const SERVICE_NAME = 'application-registry';

export const create = async (
  data: ApplicationRegistryCreate
): Promise<ApplicationRegistry> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.create`,
      attributes: {
        'application-registry.applicationKey': data.applicationKey,
        operation: 'create',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info({ data }, 'Creating new application registry');

      const registry = await getModel().create(data);
      span.setAttributes({ 'application-registry.id': registry._id });
      logger.info({ registryId: registry._id }, 'Registry created');
      return registry;
    }
  );
};

export const findById = async (id: DocId): Promise<ApplicationRegistry> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.findById`,
      attributes: {
        'application-registry.id': id,
        operation: 'findById',
      },
    },
    async () => {
      const logger = await getLogger();
      logger.info({ id }, 'Finding registry by ID');

      const registry = await getModel().findById(id);
      if (!registry) {
        throw new NotFoundError('Application registry not found');
      }
      return registry;
    }
  );
};

export const findByApplicationKey = async (
  applicationKey: DocId
): Promise<ApplicationRegistry> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.findByApplicationKey`,
      attributes: {
        'application-registry.applicationKey': applicationKey,
        operation: 'findByApplicationKey',
      },
    },
    async () => {
      const logger = await getLogger();
      logger.info({ applicationKey }, 'Finding registry by application key');

      const registry = await getModel().findOne({ applicationKey });
      if (!registry) {
        throw new NotFoundError('Application registry not found');
      }
      return registry;
    }
  );
};

export const findByApplicationIdAndTenantId = async (
  applicationId: DocId,
  tenantId: DocId
): Promise<ApplicationRegistry> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.findByApplicationIdAndTenantId`,
      attributes: {
        'application-registry.applicationId': applicationId,
        'application-registry.tenantId': tenantId,
        operation: 'findByApplicationIdAndTenantId',
      },
    },
    async () => {
      const logger = await getLogger();
      logger.info(
        { applicationId, tenantId },
        'Finding registry by application ID and tenant ID'
      );

      const registry = await getModel().findOne({ applicationId, tenantId });
      if (!registry) {
        throw new NotFoundError('Application registry not found');
      }
      return registry;
    }
  );
};

export const update = async (
  id: DocId,
  data: Partial<ApplicationRegistry>
): Promise<ApplicationRegistry> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.update`,
      attributes: {
        'application-registry.id': id,
        operation: 'update',
      },
    },
    async () => {
      const logger = await getLogger();
      logger.info({ id }, 'Updating registry');

      const registry = await getModel().findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
      if (!registry) {
        throw new NotFoundError('Application registry not found');
      }
      return registry;
    }
  );
};

export const findAllPaginated = async (
  query: PaginationQuery
): Promise<PaginatedResponse<ApplicationRegistry>> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.findAllPaginated`,
      attributes: {
        operation: 'findAllPaginated',
        'pagination.page': query.page,
        'pagination.limit': query.limit,
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info({ query }, 'Finding registries with pagination');

      return await executePagination(
        {
          model: getModel(),
          query,
          defaultSortField: 'applicationKey',
          span,
        },
        (sanitizedFilter: string) => ({
          $or: [
            { applicationKey: { $regex: sanitizedFilter, $options: 'i' } },
            { tenantId: { $regex: sanitizedFilter, $options: 'i' } },
            { applicationId: { $regex: sanitizedFilter, $options: 'i' } },
            { _id: { $regex: sanitizedFilter, $options: 'i' } },
          ],
        })
      );
    }
  );
};

export const remove = async (id: DocId): Promise<void> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.remove`,
      attributes: {
        'application-registry.id': id,
        operation: 'remove',
      },
    },
    async () => {
      const logger = await getLogger();
      logger.info({ id }, 'Deleting registry');

      const registry = await getModel().findByIdAndDelete(id);
      if (!registry) {
        throw new NotFoundError('Application registry not found');
      }
    }
  );
};
