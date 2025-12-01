import { withSpan } from '@/utils/tracing.util';
import { PolicyDocument } from './policy.model';
import {
  PolicyBaseResponse,
  PolicyCreateResponse,
  PolicyUpdateResponse,
  PolicyReadResponse,
  PolicyListItemResponse,
} from './policy.schema';

const MAPPER_NAME = 'policy.mapper';

export const toBaseResponse = (policy: PolicyDocument): PolicyBaseResponse =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toBaseResponse`,
      attributes: {
        'policy.id': policy._id.toString(),
        operation: 'toBaseResponse',
      },
    },
    () => ({
      _id: policy._id.toString(),
      version: policy.version,
      name: policy.name,
      description: policy.description,
      effect: policy.effect,
      actions: policy.actions,
      resources: policy.resources,
      createdAt: policy.createdAt.toISOString(),
      updatedAt: policy.updatedAt.toISOString(),
    })
  );

export const toCreateResponse = (
  policy: PolicyDocument
): PolicyCreateResponse =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toCreateResponse`,
      attributes: {
        'policy.id': policy._id.toString(),
        operation: 'toCreateResponse',
      },
    },
    () => toBaseResponse(policy)
  );

export const toUpdateResponse = (
  policy: PolicyDocument
): PolicyUpdateResponse =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toUpdateResponse`,
      attributes: {
        'policy.id': policy._id.toString(),
        operation: 'toUpdateResponse',
      },
    },
    () => toBaseResponse(policy)
  );

export const toReadResponse = (policy: PolicyDocument): PolicyReadResponse =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toReadResponse`,
      attributes: {
        'policy.id': policy._id.toString(),
        operation: 'toReadResponse',
      },
    },
    () => toBaseResponse(policy)
  );

export const toListItemResponse = (
  policy: PolicyDocument
): PolicyListItemResponse =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toListItemResponse`,
      attributes: {
        'policy.id': policy._id.toString(),
        operation: 'toListItemResponse',
      },
    },
    () => toBaseResponse(policy)
  );
