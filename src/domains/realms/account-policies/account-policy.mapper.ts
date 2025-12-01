import { AccountPolicyDocument } from './account-policy.model';
import { AccountPolicyBaseResponse } from './account-policy.schema';
import { withSpan } from '@/utils/tracing.util';

const MAPPER_NAME = 'account-policy.mapper';

export const toResponse = (
  accountPolicy: AccountPolicyDocument
): AccountPolicyBaseResponse =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toResponse`,
      attributes: {
        'entity.id': accountPolicy._id.toString(),
        operation: 'toResponse',
      },
    },
    () => ({
      _id: accountPolicy._id.toString(),
      accountId: accountPolicy.accountId,
      policyId: accountPolicy.policyId,
      createdAt: accountPolicy.createdAt.toISOString(),
      updatedAt: accountPolicy.updatedAt.toISOString(),
    })
  );

export const toListResponse = (
  accountPolicies: AccountPolicyDocument[]
): AccountPolicyBaseResponse[] =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toListResponse`,
      attributes: {
        'result.count': accountPolicies.length,
        operation: 'toListResponse',
      },
    },
    () => accountPolicies.map(toResponse)
  );
