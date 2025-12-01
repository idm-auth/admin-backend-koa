import { describe, it, expect } from 'vitest';
import * as policyMapper from '@/domains/realms/policies/policy.mapper';
import { PolicyDocument } from '@/domains/realms/policies/policy.model';

describe('policy.mapper.toListItemResponse', () => {
  it('should map policy to list item response format', () => {
    const input: PolicyDocument = {
      _id: 'test-id-1',
      version: '1',
      name: 'admin-policy',
      description: 'Administrator policy',
      effect: 'Allow',
      actions: ['read', 'write'],
      resources: ['users'],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    } as PolicyDocument;

    const result = policyMapper.toListItemResponse(input);

    expect(result).toEqual({
      _id: 'test-id-1',
      version: '1',
      name: 'admin-policy',
      description: 'Administrator policy',
      effect: 'Allow',
      actions: ['read', 'write'],
      resources: ['users'],
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    });
  });

  it('should handle policy without optional fields', () => {
    const input: PolicyDocument = {
      _id: 'test-id-2',
      version: '1',
      name: 'user-policy',
      effect: 'Deny',
      actions: ['delete'],
      resources: ['files'],
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-02'),
    } as PolicyDocument;

    const result = policyMapper.toListItemResponse(input);

    expect(result).toEqual({
      _id: 'test-id-2',
      version: '1',
      name: 'user-policy',
      description: undefined,
      effect: 'Deny',
      actions: ['delete'],
      resources: ['files'],
      createdAt: '2023-01-02T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    });
  });
});
