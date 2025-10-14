import { getDBName } from '@/domains/core/realms/latest/realm.service';
import {
  GroupDocument,
  getModel,
} from '@/domains/realms/groups/latest/group.model';
import { NotFoundError } from '@/errors/not-found';
import { DocId, DocIdSchema } from '@/domains/commons/base/latest/base.schema';
import { validateZod } from '@/domains/commons/validations/v1/validation.service';
import { getLogger } from '@/utils/localStorage.util';
import { GroupCreate, groupCreateSchema } from './group.schema';

export const create = async (
  tenantId: string,
  args: GroupCreate
): Promise<GroupDocument> => {
  const logger = await getLogger();
  logger.debug({ name: args.name });
  await validateZod(args, groupCreateSchema);

  const dbName = await getDBName({ publicUUID: tenantId });
  const group = await getModel(dbName).create(args);

  return group;
};

export const findById = async (
  tenantId: string,
  args: { id: DocId }
): Promise<GroupDocument> => {
  const logger = await getLogger();
  logger.debug({ tenantId: tenantId, id: args.id });
  await validateZod(args.id, DocIdSchema);
  const dbName = await getDBName({ publicUUID: tenantId });
  const group = await getModel(dbName).findById(args.id);
  if (!group) {
    throw new NotFoundError('Group not found');
  }
  return group;
};

export const findByName = async (
  tenantId: string,
  args: { name: string }
): Promise<GroupDocument> => {
  const logger = await getLogger();
  logger.debug({ name: args.name });
  const dbName = await getDBName({ publicUUID: tenantId });
  const group = await getModel(dbName).findOne({ name: args.name });
  if (!group) {
    throw new NotFoundError('Group not found');
  }
  return group;
};

export const update = async (
  tenantId: string,
  args: {
    id: string;
    name?: string;
    description?: string;
  }
): Promise<GroupDocument> => {
  const logger = await getLogger();
  logger.debug({ id: args.id });
  const dbName = await getDBName({ publicUUID: tenantId });
  const group = await getModel(dbName).findByIdAndUpdate(
    args.id,
    { name: args.name, description: args.description },
    { new: true, runValidators: true }
  );
  if (!group) {
    throw new NotFoundError('Group not found');
  }
  return group;
};

export const findAll = async (tenantId: string): Promise<GroupDocument[]> => {
  const logger = await getLogger();
  logger.debug({ tenantId });
  const dbName = await getDBName({ publicUUID: tenantId });
  const groups = await getModel(dbName).find({});
  return groups;
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
    throw new NotFoundError('Group not found');
  }
};
