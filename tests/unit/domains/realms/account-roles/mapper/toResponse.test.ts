import { describe, expect, it } from 'vitest';
import * as accountRoleMapper from '@/domains/realms/account-roles/account-role.mapper';
import { AccountRoleDocument } from '@/domains/realms/account-roles/account-role.model';

describe('account-role.mapper.toResponse', () => {
  it('should map account-role to response format', () => {
    const accountRole: AccountRoleDocument = {
      _id: 'test-id',
      accountId: 'account-123',
      roleId: 'role-456',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
    };

    const response = accountRoleMapper.toResponse(accountRole);

    expect(response).toEqual({
      _id: 'test-id',
      accountId: 'account-123',
      roleId: 'role-456',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    });
  });
});
