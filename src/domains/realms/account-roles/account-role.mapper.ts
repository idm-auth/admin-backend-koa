import { AccountRoleDocument } from './account-role.model';
import { withSpan } from '@/utils/tracing.util';

const MAPPER_NAME = 'account-role.mapper';

export interface AccountRoleResponse {
  _id: string;
  accountId: string;
  roleId: string;
  createdAt: string;
  updatedAt: string;
}

export const toResponse = (
  accountRole: AccountRoleDocument
): AccountRoleResponse =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toResponse`,
      attributes: {
        'entity.id': accountRole._id.toString(),
        operation: 'toResponse',
      },
    },
    () => ({
      _id: accountRole._id.toString(),
      accountId: accountRole.accountId,
      roleId: accountRole.roleId,
      createdAt: accountRole.createdAt.toISOString(),
      updatedAt: accountRole.updatedAt.toISOString(),
    })
  );

export const toListResponse = (
  accountRoles: AccountRoleDocument[]
): AccountRoleResponse[] =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toListResponse`,
      attributes: {
        'result.count': accountRoles.length,
        operation: 'toListResponse',
      },
    },
    () => accountRoles.map(toResponse)
  );
