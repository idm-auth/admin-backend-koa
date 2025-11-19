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
import { Group, getModel } from './group.model';
import { GroupCreate, GroupUpdate } from './group.schema';

const SERVICE_NAME = 'group';

export const create = async (
  tenantId: string,
  data: GroupCreate
): Promise<Group> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.create`,
      attributes: {
        'tenant.id': tenantId,
        'group.name': data.name,
        operation: 'create',
      },
    },
    async (span) => {
      const logger = await getLogger();

      logger.info({ tenantId, name: data.name }, 'Creating new group');

      const dbName = await getDBName({ publicUUID: tenantId });
      const group = await getModel(dbName).create(data);

      span.setAttributes({
        'group.id': group._id,
        'db.name': dbName,
      });

      logger.info(
        { groupId: group._id, tenantId },
        'Group created successfully'
      );

      return group;
    }
  );
};

export const findById = async (tenantId: string, id: DocId): Promise<Group> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.findById`,
      attributes: {
        'tenant.id': tenantId,
        'group.id': id,
        operation: 'findById',
      },
    },
    async (span) => {
      const logger = await getLogger();

      logger.info({ tenantId, id }, 'Finding group by ID');

      const dbName = await getDBName({ publicUUID: tenantId });
      const group = await getModel(dbName).findById(id);

      if (!group) {
        logger.warn({ tenantId, id }, 'Group not found');
        throw new NotFoundError('Group not found');
      }

      span.setAttributes({ 'db.name': dbName });
      logger.info({ groupId: group._id, tenantId }, 'Group found successfully');

      return group;
    }
  );
};



export const update = async (
  tenantId: string,
  id: string,
  data: GroupUpdate
): Promise<Group> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.update`,
      attributes: {
        'tenant.id': tenantId,
        'group.id': id,
        operation: 'update',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info({ tenantId, id }, 'Updating group');

      const group = await findById(tenantId, id);

      // Update fields if provided
      if (data.name !== undefined) {
        group.name = data.name;
      }
      if (data.description !== undefined) {
        group.description = data.description;
      }

      const updatedGroup = await group.save();

      span.setAttributes({ 'group.id': updatedGroup._id });
      logger.info(
        { groupId: updatedGroup._id, tenantId },
        'Group updated successfully'
      );
      return updatedGroup;
    }
  );
};

export const remove = async (tenantId: string, id: string): Promise<void> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.remove`,
      attributes: {
        'tenant.id': tenantId,
        'group.id': id,
        operation: 'remove',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info({ tenantId, id }, 'Deleting group');

      const dbName = await getDBName({ publicUUID: tenantId });
      const result = await getModel(dbName).findByIdAndDelete(id);
      if (!result) {
        logger.warn({ tenantId, id }, 'Group not found for deletion');
        throw new NotFoundError('Group not found');
      }

      span.setAttributes({ 'db.name': dbName });
      logger.info({ tenantId, id }, 'Group deleted successfully');
    }
  );
};

export const findAllPaginated = async (
  tenantId: string,
  query: PaginationQuery
): Promise<PaginatedResponse<Group>> => {
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
      logger.info({ tenantId, query }, 'Finding groups with pagination');

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
        'Groups pagination completed successfully'
      );

      return result;
    }
  );
};
