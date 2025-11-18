import { describe, expect, it } from 'vitest';
import * as groupRoleMapper from '@/domains/realms/group-roles/group-role.mapper';
import { GroupRoleDocument } from '@/domains/realms/group-roles/group-role.model';

describe('group-role.mapper.toResponse', () => {
  it('should map group-role to response format', () => {
    const groupRole: GroupRoleDocument = {
      _id: 'test-id',
      groupId: 'group-123',
      roleId: 'role-456',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
    };

    const response = groupRoleMapper.toResponse(groupRole);

    expect(response).toEqual({
      _id: 'test-id',
      groupId: 'group-123',
      roleId: 'role-456',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    });
  });
});
