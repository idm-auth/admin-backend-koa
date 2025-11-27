import { describe, it } from 'vitest';
import * as groupRoleMapper from '@/domains/realms/group-roles/group-role.mapper';
import { expectMapsObject } from '@test/utils/mapper-test-helpers';
import { GroupRoleDocument } from '@/domains/realms/group-roles/group-role.model';

describe('group-role.mapper.toResponse', () => {
  it('should map group-role to response format', () => {
    expectMapsObject(
      groupRoleMapper.toResponse,
      {
        _id: 'test-id',
        groupId: 'group-123',
        roleId: 'role-456',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      } as GroupRoleDocument,
      {
        _id: 'test-id',
        groupId: 'group-123',
        roleId: 'role-456',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
      }
    );
  });
});
