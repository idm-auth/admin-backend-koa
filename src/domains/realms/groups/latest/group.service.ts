import { getDBName } from '@/domains/core/realms/latest/realm.service';
import {
  GroupDocument,
  getModel,
} from '@/domains/realms/groups/latest/group.model';
import { NotFoundError } from '@/errors/not-found';
import { DocId } from '@/domains/commons/base/latest/base.schema';
import { getLogger } from '@/utils/localStorage.util';
import { GroupCreate } from './group.schema';

export const create = async (
  tenantId: string,
  data: GroupCreate
): Promise<GroupDocument> => {
  const logger = await getLogger();
  logger.debug({ name: data.name });

  const dbName = await getDBName(tenantId);
  const group = await getModel(dbName).create(data);

  return group;
};

export const findById = async (
  tenantId: string,
  id: DocId
): Promise<GroupDocument> => {
  const logger = await getLogger();
  logger.debug({ tenantId, id });
  const dbName = await getDBName(tenantId);
  const group = await getModel(dbName).findById(id);
  if (!group) {
    throw new NotFoundError('Group not found');
  }
  return group;
};

export const findByName = async (
  tenantId: string,
  name: string
): Promise<GroupDocument> => {
  const logger = await getLogger();
  logger.debug({ name });
  const dbName = await getDBName(tenantId);
  const group = await getModel(dbName).findOne({ name });
  if (!group) {
    throw new NotFoundError('Group not found');
  }
  return group;
};

export const update = async (
  tenantId: string,
  id: string,
  data: {
    name?: string;
    description?: string;
  }
): Promise<GroupDocument> => {
  const logger = await getLogger();
  logger.debug({ id });
  const dbName = await getDBName(tenantId);
  const group = await getModel(dbName).findByIdAndUpdate(
    id,
    { name: data.name, description: data.description },
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
  const dbName = await getDBName(tenantId);
  const groups = await getModel(dbName).find({});
  return groups;
};

export const remove = async (
  tenantId: string,
  id: string
): Promise<void> => {
  const logger = await getLogger();
  logger.debug({ id });
  const dbName = await getDBName(tenantId);
  const result = await getModel(dbName).findByIdAndDelete(id);
  if (!result) {
    throw new NotFoundError('Group not found');
  }
};
