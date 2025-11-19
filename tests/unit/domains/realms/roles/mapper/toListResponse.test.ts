import { describe, expect, it } from 'vitest';
import * as roleMapper from '@/domains/realms/roles/role.mapper';
import { RoleDocument } from '@/domains/realms/roles/role.model';

describe('role.mapper.toListResponse', () => {
  it('should map array of roles to list response format', () => {
    const roles = [
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
    ];

    const response = roleMapper.toListResponse(roles);

    expect(Array.isArray(response)).toBe(true);
    expect(response.length).toBe(2);
    
    expect(response[0]).toEqual({
      _id: 'role-1',
      name: 'Admin Role',
      description: 'Administrator role',
      permissions: ['read', 'write', 'delete'],
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    });

    expect(response[1]).toEqual({
      _id: 'role-2',
      name: 'User Role', 
      description: 'Standard user role',
      permissions: ['read'],
      createdAt: '2023-01-03T00:00:00.000Z',
      updatedAt: '2023-01-04T00:00:00.000Z',
    });
  });

  it('should handle empty array', () => {
    const roles: RoleDocument[] = [];

    const response = roleMapper.toListResponse(roles);

    expect(Array.isArray(response)).toBe(true);
    expect(response.length).toBe(0);
  });
});