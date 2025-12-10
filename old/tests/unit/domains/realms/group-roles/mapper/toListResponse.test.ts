import { describe, it } from 'vitest';
import * as groupRoleMapper from '@/domains/realms/group-roles/group-role.mapper';
import {
  expectMapsArray,
  expectHandlesEmptyArray,
} from '@test/utils/mapper-test-helpers';
import { GroupRoleDocument } from '@/domains/realms/group-roles/group-role.model';

describe('group-role.mapper.toListResponse', () => {
  it('should map array of group-roles to response format', () => {
    expectMapsArray(
      groupRoleMapper.toListResponse,
      [
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
      ] as GroupRoleDocument[],
      [
        {
          _id: 'test-id-1',
          groupId: 'group-123',
          roleId: 'role-456',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
        {
          _id: 'test-id-2',
          groupId: 'group-123',
          roleId: 'role-789',
          createdAt: '2023-01-02T00:00:00.000Z',
          updatedAt: '2023-01-02T00:00:00.000Z',
        },
      ]
    );
  });

  it('should return empty array for empty input', () => {
    expectHandlesEmptyArray(groupRoleMapper.toListResponse);
  });
});
