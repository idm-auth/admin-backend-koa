import { withSpan } from '@/utils/tracing.util';
import { PolicyDocument } from './policy.model';

const MAPPER_NAME = 'policy.mapper';

export const toResponse = (policy: PolicyDocument) =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toResponse`,
      attributes: {
        'entity.id': policy._id.toString(),
        operation: 'toResponse',
      },
    },
    () => ({
      _id: policy._id,
      name: policy.name,
      description: policy.description,
      effect: policy.effect,
      actions: policy.actions,
      resources: policy.resources,
      conditions: policy.conditions,
      createdAt: policy.createdAt.toISOString(),
      updatedAt: policy.updatedAt.toISOString(),
    })
  );

export const toListResponse = (policies: PolicyDocument[]) =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toListResponse`,
      attributes: {
        'result.count': policies.length,
        operation: 'toListResponse',
      },
    },
    () => policies.map(toResponse)
  );
