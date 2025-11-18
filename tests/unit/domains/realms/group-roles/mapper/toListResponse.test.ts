import { describe, expect, it } from 'vitest';
import * as groupRoleMapper from '@/domains/realms/group-roles/group-role.mapper';
import { GroupRoleDocument } from '@/domains/realms/group-roles/group-role.model';

describe('group-role.mapper.toListResponse', () => {
  it('should map array of group-roles to response format', () => {
    const groupRoles: GroupRoleDocument[] = [
      {
        _id: 'test-id-1',
        groupId: 'group-123',
        roleId: 'role-456',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        _id: 'test-id-2',
        groupId: 'group-123',
        roleId: 'role-789',
        createdAt: new Date('2023-01-02'),
        updatedAt: new Date('2023-01-02'),
      },
    ];

    const response = groupRoleMapper.toListResponse(groupRoles);

    expect(response).toHaveLength(2);
    expect(response[0]).toEqual({
      _id: 'test-id-1',
      groupId: 'group-123',
      roleId: 'role-456',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    });
    expect(response[1]).toEqual({
      _id: 'test-id-2',
      groupId: 'group-123',
      roleId: 'role-789',
      createdAt: '2023-01-02T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    });
  });

  it('should return empty array for empty input', () => {
    const response = groupRoleMapper.toListResponse([]);
    expect(response).toEqual([]);
  });
});
