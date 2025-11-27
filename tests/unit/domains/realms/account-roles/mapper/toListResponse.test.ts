import { describe, it } from 'vitest';
import * as accountRoleMapper from '@/domains/realms/account-roles/account-role.mapper';
import {
  expectMapsArray,
  expectHandlesEmptyArray,
} from '@test/utils/mapper-test-helpers';
import { AccountRoleDocument } from '@/domains/realms/account-roles/account-role.model';

describe('account-role.mapper.toListResponse', () => {
  it('should map array of account-roles to response format', () => {
    expectMapsArray(
      accountRoleMapper.toListResponse,
      [
        {
          _id: 'test-id-1',
          accountId: 'account-123',
          roleId: 'role-456',
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
        {
          _id: 'test-id-2',
          accountId: 'account-123',
          roleId: 'role-789',
          createdAt: new Date('2023-01-02'),
          updatedAt: new Date('2023-01-02'),
        },
      ] as AccountRoleDocument[],
      [
        {
          _id: 'test-id-1',
          accountId: 'account-123',
          roleId: 'role-456',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
        {
          _id: 'test-id-2',
          accountId: 'account-123',
          roleId: 'role-789',
          createdAt: '2023-01-02T00:00:00.000Z',
          updatedAt: '2023-01-02T00:00:00.000Z',
        },
      ]
    );
  });

  it('should return empty array for empty input', () => {
    expectHandlesEmptyArray(accountRoleMapper.toListResponse);
  });
});
