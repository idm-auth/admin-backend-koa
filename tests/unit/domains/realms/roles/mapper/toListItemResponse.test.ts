import { describe, expect, it } from 'vitest';
import * as roleMapper from '@/domains/realms/roles/role.mapper';
import { RoleDocument } from '@/domains/realms/roles/role.model';

describe('role.mapper.toListItemResponse', () => {
  it('should map role to list item response format', () => {
    const role = {
      _id: 'test-id',
      name: 'admin',
      description: 'Administrator role',
      permissions: ['read', 'write'],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
    } as RoleDocument;

    const response = roleMapper.toListItemResponse(role);

    expect(response).toEqual({
      _id: 'test-id',
      name: 'admin',
      description: 'Administrator role',
      permissions: ['read', 'write'],
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    });
  });

  it('should handle role without description', () => {
    const role = {
      _id: 'test-id',
      name: 'basic-role',
      permissions: ['read'],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    } as RoleDocument;

    const response = roleMapper.toListItemResponse(role);

    expect(response).toEqual({
      _id: 'test-id',
      name: 'basic-role',
      description: undefined,
      permissions: ['read'],
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    });
  });
});
