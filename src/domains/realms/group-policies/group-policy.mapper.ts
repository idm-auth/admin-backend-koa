import { GroupPolicyDocument } from './group-policy.model';
import { GroupPolicyBaseResponse } from './group-policy.schema';
import { withSpan } from '@/utils/tracing.util';

const MAPPER_NAME = 'group-policy.mapper';

export const toResponse = (
  groupPolicy: GroupPolicyDocument
): GroupPolicyBaseResponse =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toResponse`,
      attributes: {
        'entity.id': groupPolicy._id.toString(),
        operation: 'toResponse',
      },
    },
    () => ({
      _id: groupPolicy._id.toString(),
      groupId: groupPolicy.groupId,
      policyId: groupPolicy.policyId,
      createdAt: groupPolicy.createdAt.toISOString(),
      updatedAt: groupPolicy.updatedAt.toISOString(),
    })
  );

export const toListResponse = (
  groupPolicies: GroupPolicyDocument[]
): GroupPolicyBaseResponse[] =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toListResponse`,
      attributes: {
        'result.count': groupPolicies.length,
        operation: 'toListResponse',
      },
    },
    () => groupPolicies.map(toResponse)
  );
