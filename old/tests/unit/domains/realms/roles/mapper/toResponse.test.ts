import { describe, it } from 'vitest';
import * as roleMapper from '@/domains/realms/roles/role.mapper';
import { expectMapsObject } from '@test/utils/mapper-test-helpers';
import { RoleDocument } from '@/domains/realms/roles/role.model';

describe('role.mapper.toResponse', () => {
  it('should map role to response format', () => {
    expectMapsObject(
      roleMapper.toResponse,
      {
        _id: 'test-id',
        name: 'admin',
        description: 'Administrator role',
        permissions: ['read', 'write'],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      } as RoleDocument,
      {
        _id: 'test-id',
        name: 'admin',
        description: 'Administrator role',
        permissions: ['read', 'write'],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
      }
    );
  });

  it('should handle role without optional fields', () => {
    expectMapsObject(
      roleMapper.toResponse,
      {
        _id: 'test-id',
        name: 'basic-role',
        permissions: [],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      } as RoleDocument,
      {
        _id: 'test-id',
        name: 'basic-role',
        description: undefined,
        permissions: [],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      }
    );
  });
});
