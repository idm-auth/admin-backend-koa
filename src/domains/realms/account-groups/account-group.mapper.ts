import { AccountGroupDocument } from './account-group.model';
import { AccountGroupBaseResponse } from './account-group.schema';
import { withSpan } from '@/utils/tracing.util';

const MAPPER_NAME = 'account-group.mapper';

export const toResponse = (
  accountGroup: AccountGroupDocument
): AccountGroupBaseResponse =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toResponse`,
      attributes: {
        'entity.id': accountGroup._id.toString(),
        operation: 'toResponse',
      },
    },
    () => ({
      _id: accountGroup._id.toString(),
      accountId: accountGroup.accountId,
      groupId: accountGroup.groupId,
      roles: accountGroup.roles,
      createdAt: accountGroup.createdAt.toISOString(),
      updatedAt: accountGroup.updatedAt.toISOString(),
    })
  );

export const toListResponse = (
  accountGroups: AccountGroupDocument[]
): AccountGroupBaseResponse[] =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toListResponse`,
      attributes: {
        'result.count': accountGroups.length,
        operation: 'toListResponse',
      },
    },
    () => accountGroups.map(toResponse)
  );
