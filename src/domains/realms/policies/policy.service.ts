import { PolicyDocument, getModel } from './policy.model';
import { DocId } from '@/domains/commons/base/base.schema';
import { PolicyCreate } from './policy.schema';
import { getDBName } from '@/domains/core/realms/realm.service';
import { getLogger } from '@/utils/localStorage.util';
import { NotFoundError } from '@/errors/not-found';
import { sanitizeRegexInputForFilter } from '@/utils/pagination.util';

export const create = async (
  tenantId: string,
  data: PolicyCreate
): Promise<PolicyDocument> => {
  const logger = await getLogger();
  logger.debug({ name: data.name });

  const dbName = await getDBName(tenantId);
  const policy = await getModel(dbName).create(data);

  return policy;
};

export const findById = async (
  tenantId: string,
  id: DocId
): Promise<PolicyDocument> => {
  const logger = await getLogger();
  logger.debug({ tenantId, id });
  const dbName = await getDBName(tenantId);
  const policy = await getModel(dbName).findById(id);
  if (!policy) {
    throw new NotFoundError('Policy not found');
  }
  return policy;
};

export const findByName = async (
  tenantId: string,
  name: string
): Promise<PolicyDocument> => {
  const logger = await getLogger();
  logger.debug({ name });
  const dbName = await getDBName(tenantId);
  const sanitizedName = sanitizeRegexInputForFilter(name);
  const policy = await getModel(dbName).findOne({ name: sanitizedName });
  if (!policy) {
    throw new NotFoundError('Policy not found');
  }
  return policy;
};

export const update = async (
  tenantId: string,
  id: string,
  data: {
    name?: string;
    description?: string;
    effect?: 'Allow' | 'Deny';
    actions?: string[];
    resources?: string[];
    conditions?: Record<string, string>;
  }
): Promise<PolicyDocument> => {
  const logger = await getLogger();
  logger.debug({ id });
  const dbName = await getDBName(tenantId);
  const policy = await getModel(dbName).findByIdAndUpdate(
    id,
    {
      name: data.name,
      description: data.description,
      effect: data.effect,
      actions: data.actions,
      resources: data.resources,
      conditions: data.conditions,
    },
    { new: true, runValidators: true }
  );
  if (!policy) {
    throw new NotFoundError('Policy not found');
  }
  return policy;
};

export const remove = async (tenantId: string, id: string): Promise<void> => {
  const logger = await getLogger();
  logger.debug({ id });
  const dbName = await getDBName(tenantId);
  const result = await getModel(dbName).findByIdAndDelete(id);
  if (!result) {
    throw new NotFoundError('Policy not found');
  }
};
