import { NotFoundError } from '@/errors/not-found';
import { ConflictError } from '@/errors/conflict';
import { getDBName } from '@/domains/core/realms/realm.service';
import { withSpanAsync } from '@/utils/tracing.util';
import { getModel, PolicyCreate } from './policy.model';
import { PolicyUpdate } from './policy.schema';

const SERVICE_NAME = 'policy.service';

export const create = async (tenantId: string, data: PolicyCreate) => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.create`,
      attributes: { 'tenant.id': tenantId, operation: 'create' },
    },
    async (span) => {
      const dbName = await getDBName({ publicUUID: tenantId });
      const PolicyModel = getModel(dbName);

      const existingPolicy = await PolicyModel.findOne({ name: data.name });
      if (existingPolicy) {
        throw new ConflictError('Policy with this name already exists');
      }

      const policy = await PolicyModel.create(data);
      span.setAttributes({ 'policy.id': policy._id });
      return policy;
    }
  );
};

export const findById = async (tenantId: string, id: string) => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.findById`,
      attributes: {
        'tenant.id': tenantId,
        'policy.id': id,
        operation: 'findById',
      },
    },
    async () => {
      const dbName = await getDBName({ publicUUID: tenantId });
      const PolicyModel = getModel(dbName);

      const policy = await PolicyModel.findById(id);
      if (!policy) {
        throw new NotFoundError('Policy not found');
      }

      return policy;
    }
  );
};

export const update = async (
  tenantId: string,
  id: string,
  data: PolicyUpdate
) => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.update`,
      attributes: {
        'tenant.id': tenantId,
        'policy.id': id,
        operation: 'update',
      },
    },
    async () => {
      const dbName = await getDBName({ publicUUID: tenantId });
      const PolicyModel = getModel(dbName);

      if (data.name) {
        const existingPolicy = await PolicyModel.findOne({
          name: data.name,
          _id: { $ne: id },
        });
        if (existingPolicy) {
          throw new ConflictError('Policy with this name already exists');
        }
      }

      const policy = await PolicyModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!policy) {
        throw new NotFoundError('Policy not found');
      }

      return policy;
    }
  );
};

export const remove = async (tenantId: string, id: string) => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.remove`,
      attributes: {
        'tenant.id': tenantId,
        'policy.id': id,
        operation: 'remove',
      },
    },
    async () => {
      const dbName = await getDBName({ publicUUID: tenantId });
      const PolicyModel = getModel(dbName);

      const policy = await PolicyModel.findByIdAndDelete(id);
      if (!policy) {
        throw new NotFoundError('Policy not found');
      }

      return policy;
    }
  );
};

export const list = async (tenantId: string, page = 1, limit = 25) => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.list`,
      attributes: { 'tenant.id': tenantId, operation: 'list', page, limit },
    },
    async () => {
      const dbName = await getDBName({ publicUUID: tenantId });
      const PolicyModel = getModel(dbName);

      const skip = (page - 1) * limit;

      const [policies, total] = await Promise.all([
        PolicyModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
        PolicyModel.countDocuments(),
      ]);

      return {
        data: policies,
        pagination: {
          page,
          rowsPerPage: limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }
  );
};
