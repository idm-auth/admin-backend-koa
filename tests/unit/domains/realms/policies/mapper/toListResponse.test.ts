import { describe, it } from 'vitest';
import * as policyMapper from '@/domains/realms/policies/policy.mapper';
import {
  expectMapsArray,
  expectHandlesEmptyArray,
} from '@test/utils/mapper-test-helpers';
import { PolicyDocument } from '@/domains/realms/policies/policy.model';

describe('policy.mapper.toListResponse', () => {
  it('should map array of policies to response format', () => {
    expectMapsArray(
      policyMapper.toListResponse,
      [
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
      ] as PolicyDocument[],
      [
        {
          _id: 'test-id-1',
          name: 'admin-policy',
          description: 'Administrator policy',
          effect: 'Allow',
          actions: ['read', 'write'],
          resources: ['users'],
          conditions: { ip: '192.168.1.0/24' },
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
        {
          _id: 'test-id-2',
          name: 'user-policy',
          description: undefined,
          effect: 'Deny',
          actions: ['delete'],
          resources: ['files'],
          conditions: undefined,
          createdAt: '2023-01-02T00:00:00.000Z',
          updatedAt: '2023-01-02T00:00:00.000Z',
        },
      ]
    );
  });

  it('should return empty array for empty input', () => {
    expectHandlesEmptyArray(policyMapper.toListResponse);
  });
});
