import { GroupRoleDocument, getModel } from './group-role.model';
import { DocId } from '@/domains/commons/base/base.schema';
import { GroupRoleCreate } from './group-role.schema';
import { getDBName } from '@/domains/core/realms/realm.service';
import { getLogger } from '@/utils/localStorage.util';
import { NotFoundError } from '@/errors/not-found';

export const addRoleToGroup = async (
  tenantId: string,
  data: GroupRoleCreate
): Promise<GroupRoleDocument> => {
  const logger = await getLogger();
  logger.debug({ groupId: data.groupId, roleId: data.roleId });

  const dbName = await getDBName(tenantId);
  const groupRole = await getModel(dbName).create(data);

  return groupRole;
};

export const removeRoleFromGroup = async (
  tenantId: string,
  groupId: string,
  roleId: string
): Promise<void> => {
  const logger = await getLogger();
  logger.debug({ groupId, roleId });

  const dbName = await getDBName(tenantId);
  const result = await getModel(dbName).findOneAndDelete({
    groupId,
    roleId,
  });

  if (!result) {
    throw new NotFoundError('Group-Role relationship not found');
  }
};

export const getGroupRoles = async (
  tenantId: string,
  groupId: DocId
): Promise<GroupRoleDocument[]> => {
  const logger = await getLogger();
  logger.debug({ groupId });

  const dbName = await getDBName(tenantId);
  const groupRoles = await getModel(dbName).find({ groupId });

  return groupRoles;
};



export const getRoleGroups = async (
  tenantId: string,
  roleId: DocId
): Promise<GroupRoleDocument[]> => {
  const logger = await getLogger();
  logger.debug({ roleId });

  const dbName = await getDBName(tenantId);
  const roleGroups = await getModel(dbName).find({ roleId });

  return roleGroups;
};
