import { describe, expect, it } from 'vitest';
import * as policyMapper from '@/domains/realms/policies/policy.mapper';
import { PolicyDocument } from '@/domains/realms/policies/policy.model';

describe('policy.mapper.toResponse', () => {
  it('should map policy to response format', () => {
    const policy: PolicyDocument = {
      _id: 'test-id',
      name: 'admin-policy',
      description: 'Administrator policy',
      effect: 'Allow',
      actions: ['read', 'write'],
      resources: ['users', 'groups'],
      conditions: { ip: '192.168.1.0/24' },
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
    };

    const response = policyMapper.toResponse(policy);

    expect(response).toEqual({
      _id: 'test-id',
      name: 'admin-policy',
      description: 'Administrator policy',
      effect: 'Allow',
      actions: ['read', 'write'],
      resources: ['users', 'groups'],
      conditions: { ip: '192.168.1.0/24' },
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    });
  });

  it('should handle policy without optional fields', () => {
    const policy: PolicyDocument = {
      _id: 'test-id',
      name: 'basic-policy',
      effect: 'Deny',
      actions: ['delete'],
      resources: ['files'],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    };

    const response = policyMapper.toResponse(policy);

    expect(response).toEqual({
      _id: 'test-id',
      name: 'basic-policy',
      description: undefined,
      effect: 'Deny',
      actions: ['delete'],
      resources: ['files'],
      conditions: undefined,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    });
  });
});
