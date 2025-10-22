import {
  PolicyDocument,
  getModel,
} from '@/domains/realms/policies/latest/policy.model';
import { DocId } from '@/domains/commons/base/latest/base.schema';
import {
  PolicyCreate,
} from '@/domains/realms/policies/latest/policy.schema';
import { getDBName } from '@/domains/core/realms/latest/realm.service';
import { getLogger } from '@/utils/localStorage.util';
import { NotFoundError } from '@/errors/not-found';

export const create = async (
  tenantId: string,
  args: PolicyCreate
): Promise<PolicyDocument> => {
  const logger = await getLogger();
  logger.debug({ name: args.name });

  const dbName = await getDBName({ publicUUID: tenantId });
  const policy = await getModel(dbName).create(args);

  return policy;
};

export const findById = async (
  tenantId: string,
  args: { id: DocId }
): Promise<PolicyDocument> => {
  const logger = await getLogger();
  logger.debug({ tenantId: tenantId, id: args.id });
  const dbName = await getDBName({ publicUUID: tenantId });
  const policy = await getModel(dbName).findById(args.id);
  if (!policy) {
    throw new NotFoundError('Policy not found');
  }
  return policy;
};

export const findByName = async (
  tenantId: string,
  args: { name: string }
): Promise<PolicyDocument> => {
  const logger = await getLogger();
  logger.debug({ name: args.name });
  const dbName = await getDBName({ publicUUID: tenantId });
  const policy = await getModel(dbName).findOne({ name: args.name });
  if (!policy) {
    throw new NotFoundError('Policy not found');
  }
  return policy;
};

export const update = async (
  tenantId: string,
  args: {
    id: string;
    name?: string;
    description?: string;
    effect?: 'Allow' | 'Deny';
    actions?: string[];
    resources?: string[];
    conditions?: Record<string, string>;
  }
): Promise<PolicyDocument> => {
  const logger = await getLogger();
  logger.debug({ id: args.id });
  const dbName = await getDBName({ publicUUID: tenantId });
  const policy = await getModel(dbName).findByIdAndUpdate(
    args.id,
    {
      name: args.name,
      description: args.description,
      effect: args.effect,
      actions: args.actions,
      resources: args.resources,
      conditions: args.conditions,
    },
    { new: true, runValidators: true }
  );
  if (!policy) {
    throw new NotFoundError('Policy not found');
  }
  return policy;
};

export const findAll = async (tenantId: string): Promise<PolicyDocument[]> => {
  const logger = await getLogger();
  logger.debug({ tenantId });
  const dbName = await getDBName({ publicUUID: tenantId });
  const policies = await getModel(dbName).find({});
  return policies;
};

export const remove = async (
  tenantId: string,
  args: { id: string }
): Promise<void> => {
  const logger = await getLogger();
  logger.debug({ id: args.id });
  const dbName = await getDBName({ publicUUID: tenantId });
  const result = await getModel(dbName).findByIdAndDelete(args.id);
  if (!result) {
    throw new NotFoundError('Policy not found');
  }
};
