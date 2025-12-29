import { withSpan } from '@/utils/tracing.util';
import { GroupRoleDocument } from './group-role.model';

const MAPPER_NAME = 'group-role.mapper';

export const toResponse = (groupRole: GroupRoleDocument) =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toResponse`,
      attributes: {
        'entity.id': groupRole._id.toString(),
        operation: 'toResponse',
      },
    },
    () => ({
      _id: groupRole._id,
      groupId: groupRole.groupId,
      roleId: groupRole.roleId,
      createdAt: groupRole.createdAt.toISOString(),
      updatedAt: groupRole.updatedAt.toISOString(),
    })
  );

export const toListResponse = (groupRoles: GroupRoleDocument[]) =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toListResponse`,
      attributes: {
        'result.count': groupRoles.length,
        operation: 'toListResponse',
      },
    },
    () => groupRoles.map(toResponse)
  );
