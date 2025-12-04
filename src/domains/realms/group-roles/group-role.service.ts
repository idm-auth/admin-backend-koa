import { PublicUUID } from '@/domains/commons/base/base.schema';
import { getDBName } from '@/domains/core/realms/realm.service';
import { NotFoundError } from '@/errors/not-found';
import { getLogger } from '@/utils/localStorage.util';
import { withSpanAsync } from '@/utils/tracing.util';
import { GroupRoleDocument, getModel } from './group-role.model';
import { GroupRoleCreate } from './group-role.schema';

const SERVICE_NAME = 'group-role.service';

export const addRoleToGroup = async (
  tenantId: PublicUUID,
  data: GroupRoleCreate
): Promise<GroupRoleDocument> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.addRoleToGroup`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'addRoleToGroup',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.debug({ groupId: data.groupId, roleId: data.roleId });

      const dbName = await getDBName({ publicUUID: tenantId });
      const groupRole = await getModel(dbName).create(data);

      span.setAttributes({ 'entity.id': groupRole._id });
      return groupRole;
    }
  );
};

export const removeRoleFromGroup = async (
  tenantId: PublicUUID,
  data: { groupId: string; roleId: string }
): Promise<void> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.removeRoleFromGroup`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'removeRoleFromGroup',
      },
    },
    async () => {
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
    }
  );
};

export const getGroupRoles = async (
  tenantId: PublicUUID,
  data: { groupId: string }
): Promise<GroupRoleDocument[]> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.getGroupRoles`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'getGroupRoles',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.debug({ groupId: data.groupId });

      const dbName = await getDBName({ publicUUID: tenantId });
      const groupRoles = await getModel(dbName).find({ groupId: data.groupId });

      span.setAttributes({ 'result.count': groupRoles.length });
      return groupRoles;
    }
  );
};

export const getRoleGroups = async (
  tenantId: PublicUUID,
  data: { roleId: string }
): Promise<GroupRoleDocument[]> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.getRoleGroups`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'getRoleGroups',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.debug({ roleId: data.roleId });

      const dbName = await getDBName({ publicUUID: tenantId });
      const roleGroups = await getModel(dbName).find({ roleId: data.roleId });

      span.setAttributes({ 'result.count': roleGroups.length });
      return roleGroups;
    }
  );
};
