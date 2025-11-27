import { describe, it } from 'vitest';
import * as roleMapper from '@/domains/realms/roles/role.mapper';
import {
  expectMapsArray,
  expectHandlesEmptyArray,
} from '@test/utils/mapper-test-helpers';
import { RoleDocument } from '@/domains/realms/roles/role.model';

describe('role.mapper.toListResponse', () => {
  it('should map array of roles to list response format', () => {
    expectMapsArray(
      roleMapper.toListResponse,
      [
        {
          _id: 'role-1',
          name: 'Admin Role',
          description: 'Administrator role',
          permissions: ['read', 'write', 'delete'],
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-02'),
        } as RoleDocument,
        {
          _id: 'role-2',
          name: 'User Role',
          description: 'Standard user role',
          permissions: ['read'],
          createdAt: new Date('2023-01-03'),
          updatedAt: new Date('2023-01-04'),
        } as RoleDocument,
      ],
      [
        {
          _id: 'role-1',
          name: 'Admin Role',
          description: 'Administrator role',
          permissions: ['read', 'write', 'delete'],
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-02T00:00:00.000Z',
        },
        {
          _id: 'role-2',
          name: 'User Role',
          description: 'Standard user role',
          permissions: ['read'],
          createdAt: '2023-01-03T00:00:00.000Z',
          updatedAt: '2023-01-04T00:00:00.000Z',
        },
      ]
    );
  });

  it('should handle empty array', () => {
    expectHandlesEmptyArray(roleMapper.toListResponse);
  });
});
