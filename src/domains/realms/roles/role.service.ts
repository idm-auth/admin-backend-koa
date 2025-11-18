import { RoleDocument, getModel } from './role.model';
import { DocId } from '@/domains/commons/base/base.schema';
import {
  PaginatedResponse,
  PaginationQuery,
} from '@/domains/commons/base/pagination.schema';
import { RoleCreate } from './role.schema';
import { getDBName } from '@/domains/core/realms/realm.service';
import { getLogger } from '@/utils/localStorage.util';
import { NotFoundError } from '@/errors/not-found';
import { withSpanAsync } from '@/utils/tracing.util';
import { executePagination } from '@/utils/pagination.util';

const SERVICE_NAME = 'role.service';

export const create = async (
  tenantId: string,
  data: RoleCreate
): Promise<RoleDocument> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.create`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'create',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.debug({ name: data.name });

      const dbName = await getDBName({ publicUUID: tenantId });
      const role = await getModel(dbName).create(data);

      span.setAttributes({ 'entity.id': role._id });
      return role;
    }
  );
};

export const findById = async (
  tenantId: string,
  id: DocId
): Promise<RoleDocument> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.findById`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'findById',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.debug({ tenantId, id });
      const dbName = await getDBName({ publicUUID: tenantId });
      const role = await getModel(dbName).findById(id);
      if (!role) {
        throw new NotFoundError('Role not found');
      }
      span.setAttributes({ 'entity.id': role._id });
      return role;
    }
  );
};

export const findByName = async (
  tenantId: string,
  name: string
): Promise<RoleDocument> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.findByName`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'findByName',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.debug({ name });
      const dbName = await getDBName({ publicUUID: tenantId });
      const role = await getModel(dbName).findOne({ name });
      if (!role) {
        throw new NotFoundError('Role not found');
      }
      span.setAttributes({ 'entity.id': role._id });
      return role;
    }
  );
};

export const update = async (
  tenantId: string,
  id: string,
  data: {
    name?: string;
    description?: string;
    permissions?: string[];
  }
): Promise<RoleDocument> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.update`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'update',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.debug({ id });
      const dbName = await getDBName({ publicUUID: tenantId });
      const role = await getModel(dbName).findByIdAndUpdate(
        id,
        {
          name: data.name,
          description: data.description,
          permissions: data.permissions,
        },
        { new: true, runValidators: true }
      );
      if (!role) {
        throw new NotFoundError('Role not found');
      }
      span.setAttributes({ 'entity.id': role._id });
      return role;
    }
  );
};

export const remove = async (tenantId: string, id: string): Promise<void> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.remove`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'remove',
      },
    },
    async () => {
      const logger = await getLogger();
      logger.debug({ id });
      const dbName = await getDBName({ publicUUID: tenantId });
      const result = await getModel(dbName).findByIdAndDelete(id);
      if (!result) {
        throw new NotFoundError('Role not found');
      }
    }
  );
};

export const findAllPaginated = async (
  tenantId: string,
  query: PaginationQuery
): Promise<PaginatedResponse<RoleDocument>> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.findAllPaginated`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'findAllPaginated',
        'pagination.page': query.page,
        'pagination.limit': query.limit,
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info({ tenantId, query }, 'Finding roles with pagination');

      try {
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
              { description: { $regex: sanitizedFilter, $options: 'i' } },
              { _id: { $regex: sanitizedFilter, $options: 'i' } },
            ],
          })
        );

        logger.info(
          {
            tenantId,
            total: result.pagination.total,
            page: result.pagination.page,
          },
          'Roles pagination completed successfully'
        );

        return result;
      } catch (error) {
        logger.error(error, 'Failed to find paginated roles');
        throw new Error('Failed to retrieve roles');
      }
    }
  );
};
