import { getDBName } from '@/domains/core/realms/realm.service';
import { NotFoundError } from '@/errors/not-found';
import { getLogger } from '@/utils/localStorage.util';
import { GroupRoleDocument, getModel } from './group-role.model';
import { GroupRoleCreate } from './group-role.schema';

export const addRoleToGroup = async (
  tenantId: string,
  data: GroupRoleCreate
): Promise<GroupRoleDocument> => {
  const logger = await getLogger();
  logger.debug({ groupId: data.groupId, roleId: data.roleId });

  const dbName = await getDBName({ publicUUID: tenantId });
  const groupRole = await getModel(dbName).create(data);

  return groupRole;
};

export const removeRoleFromGroup = async (
  tenantId: string,
  data: { groupId: string; roleId: string }
): Promise<void> => {
  const logger = await getLogger();
  logger.debug({ groupId: data.groupId, roleId: data.roleId });

  const dbName = await getDBName({ publicUUID: tenantId });
  const result = await getModel(dbName).findOneAndDelete({
    groupId: data.groupId,
    roleId: data.roleId,
  });

  if (!result) {
    throw new NotFoundError('Group-Role relationship not found');
  }
};

export const getGroupRoles = async (
  tenantId: string,
  data: { groupId: string }
): Promise<GroupRoleDocument[]> => {
  const logger = await getLogger();
  logger.debug({ groupId: data.groupId });

  const dbName = await getDBName({ publicUUID: tenantId });
  const groupRoles = await getModel(dbName).find({ groupId: data.groupId });

  return groupRoles;
};

export const getRoleGroups = async (
  tenantId: string,
  data: { roleId: string }
): Promise<GroupRoleDocument[]> => {
  const logger = await getLogger();
  logger.debug({ roleId: data.roleId });

  const dbName = await getDBName({ publicUUID: tenantId });
  const roleGroups = await getModel(dbName).find({ roleId: data.roleId });

  return roleGroups;
};
