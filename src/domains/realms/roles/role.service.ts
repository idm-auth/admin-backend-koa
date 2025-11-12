import { RoleDocument, getModel } from './role.model';
import { DocId } from '@/domains/commons/base/base.schema';
import { RoleCreate } from './role.schema';
import { getDBName } from '@/domains/core/realms/realm.service';
import { getLogger } from '@/utils/localStorage.util';
import { NotFoundError } from '@/errors/not-found';

export const create = async (
  tenantId: string,
  data: RoleCreate
): Promise<RoleDocument> => {
  const logger = await getLogger();
  logger.debug({ name: data.name });

  const dbName = await getDBName(tenantId);
  const role = await getModel(dbName).create(data);

  return role;
};

export const findById = async (
  tenantId: string,
  id: DocId
): Promise<RoleDocument> => {
  const logger = await getLogger();
  logger.debug({ tenantId, id });
  const dbName = await getDBName(tenantId);
  const role = await getModel(dbName).findById(id);
  if (!role) {
    throw new NotFoundError('Role not found');
  }
  return role;
};

export const findByName = async (
  tenantId: string,
  name: string
): Promise<RoleDocument> => {
  const logger = await getLogger();
  logger.debug({ name });
  const dbName = await getDBName(tenantId);
  const role = await getModel(dbName).findOne({ name });
  if (!role) {
    throw new NotFoundError('Role not found');
  }
  return role;
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
  const logger = await getLogger();
  logger.debug({ id });
  const dbName = await getDBName(tenantId);
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
  return role;
};

export const remove = async (tenantId: string, id: string): Promise<void> => {
  const logger = await getLogger();
  logger.debug({ id });
  const dbName = await getDBName(tenantId);
  const result = await getModel(dbName).findByIdAndDelete(id);
  if (!result) {
    throw new NotFoundError('Role not found');
  }
};
