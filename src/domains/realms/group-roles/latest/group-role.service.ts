import { GroupRoleDocument, getModel } from './group-role.model';
import { DocId, DocIdSchema } from '@/schemas/latest/base.schema';
import { GroupRoleCreate, groupRoleCreateSchema } from './group-role.schema';
import { getDBName } from '@/services/v1/realm.service';
import { validateZod } from '@/services/v1/validation.service';
import { getLogger } from '@/utils/localStorage.util';
import { NotFoundError } from '@/errors/not-found';

export const addRoleToGroup = async (
  tenantId: string,
  args: GroupRoleCreate
): Promise<GroupRoleDocument> => {
  const logger = await getLogger();
  logger.debug({ groupId: args.groupId, roleId: args.roleId });
  await validateZod(args, groupRoleCreateSchema);

  const dbName = await getDBName({ publicUUID: tenantId });
  const groupRole = await getModel(dbName).create(args);

  return groupRole;
};

export const removeRoleFromGroup = async (
  tenantId: string,
  args: { groupId: string; roleId: string }
): Promise<void> => {
  const logger = await getLogger();
  logger.debug({ groupId: args.groupId, roleId: args.roleId });
  
  const dbName = await getDBName({ publicUUID: tenantId });
  const result = await getModel(dbName).findOneAndDelete({
    groupId: args.groupId,
    roleId: args.roleId,
  });
  
  if (!result) {
    throw new NotFoundError('Group-Role relationship not found');
  }
};

export const getGroupRoles = async (
  tenantId: string,
  args: { groupId: DocId }
): Promise<GroupRoleDocument[]> => {
  const logger = await getLogger();
  logger.debug({ groupId: args.groupId });
  await validateZod(args.groupId, DocIdSchema);
  
  const dbName = await getDBName({ publicUUID: tenantId });
  const groupRoles = await getModel(dbName).find({ groupId: args.groupId });
  
  return groupRoles;
};

export const getRoleGroups = async (
  tenantId: string,
  args: { roleId: DocId }
): Promise<GroupRoleDocument[]> => {
  const logger = await getLogger();
  logger.debug({ roleId: args.roleId });
  await validateZod(args.roleId, DocIdSchema);
  
  const dbName = await getDBName({ publicUUID: tenantId });
  const roleGroups = await getModel(dbName).find({ roleId: args.roleId });
  
  return roleGroups;
};