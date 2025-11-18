import { describe, expect, it } from 'vitest';
import * as accountRoleMapper from '@/domains/realms/account-roles/account-role.mapper';
import { AccountRoleDocument } from '@/domains/realms/account-roles/account-role.model';

describe('account-role.mapper.toListResponse', () => {
  it('should map array of account-roles to response format', () => {
    const accountRoles: AccountRoleDocument[] = [
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
    ];

    const response = accountRoleMapper.toListResponse(accountRoles);

    expect(response).toHaveLength(2);
    expect(response[0]).toEqual({
      _id: 'test-id-1',
      accountId: 'account-123',
      roleId: 'role-456',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    });
    expect(response[1]).toEqual({
      _id: 'test-id-2',
      accountId: 'account-123',
      roleId: 'role-789',
      createdAt: '2023-01-02T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    });
  });

  it('should return empty array for empty input', () => {
    const response = accountRoleMapper.toListResponse([]);
    expect(response).toEqual([]);
  });
});
