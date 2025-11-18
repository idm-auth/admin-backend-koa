import { describe, expect, it } from 'vitest';
import * as policyMapper from '@/domains/realms/policies/policy.mapper';
import { PolicyDocument } from '@/domains/realms/policies/policy.model';

describe('policy.mapper.toListResponse', () => {
  it('should map array of policies to response format', () => {
    const policies: PolicyDocument[] = [
      {
        _id: 'test-id-1',
        name: 'admin-policy',
        description: 'Administrator policy',
        effect: 'Allow',
        actions: ['read', 'write'],
        resources: ['users'],
        conditions: { ip: '192.168.1.0/24' },
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        _id: 'test-id-2',
        name: 'user-policy',
        effect: 'Deny',
        actions: ['delete'],
        resources: ['files'],
        createdAt: new Date('2023-01-02'),
        updatedAt: new Date('2023-01-02'),
      },
    ];

    const response = policyMapper.toListResponse(policies);

    expect(response).toHaveLength(2);
    expect(response[0]).toEqual({
      _id: 'test-id-1',
      name: 'admin-policy',
      description: 'Administrator policy',
      effect: 'Allow',
      actions: ['read', 'write'],
      resources: ['users'],
      conditions: { ip: '192.168.1.0/24' },
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    });
    expect(response[1]).toEqual({
      _id: 'test-id-2',
      name: 'user-policy',
      description: undefined,
      effect: 'Deny',
      actions: ['delete'],
      resources: ['files'],
      conditions: undefined,
      createdAt: '2023-01-02T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    });
  });

  it('should return empty array for empty input', () => {
    const response = policyMapper.toListResponse([]);
    expect(response).toEqual([]);
  });
});
