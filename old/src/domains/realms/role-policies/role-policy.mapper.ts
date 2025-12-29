import { RolePolicyDocument } from './role-policy.model';
import { RolePolicyBaseResponse } from './role-policy.schema';
import { withSpan } from '@/utils/tracing.util';

const MAPPER_NAME = 'role-policy.mapper';

export const toResponse = (
  rolePolicy: RolePolicyDocument
): RolePolicyBaseResponse =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toResponse`,
      attributes: {
        'entity.id': rolePolicy._id.toString(),
        operation: 'toResponse',
      },
    },
    () => ({
      _id: rolePolicy._id.toString(),
      roleId: rolePolicy.roleId,
      policyId: rolePolicy.policyId,
      createdAt: rolePolicy.createdAt.toISOString(),
      updatedAt: rolePolicy.updatedAt.toISOString(),
    })
  );

export const toListResponse = (
  rolePolicies: RolePolicyDocument[]
): RolePolicyBaseResponse[] =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toListResponse`,
      attributes: {
        'result.count': rolePolicies.length,
        operation: 'toListResponse',
      },
    },
    () => rolePolicies.map(toResponse)
  );
