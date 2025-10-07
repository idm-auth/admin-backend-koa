import {
  GroupDocument,
  getModel,
} from '@/domains/realms/groups/latest/group.model';
import { DocId, DocIdSchema } from '@/schemas/latest/base.schema';
import { GroupCreate, groupCreateSchema } from '@/domains/realms/groups/latest/group.schema';
import { getDBName } from '@/services/v1/realm.service';
import { validateZod } from '@/services/v1/validation.service';
import { getLogger } from '@/utils/localStorage.util';
import { NotFoundError } from '@/errors/not-found';

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