import { describe, expect, it } from 'vitest';
import * as accountGroupMapper from '@/domains/realms/account-groups/account-group.mapper';
import { AccountGroupDocument } from '@/domains/realms/account-groups/account-group.model';

describe('account-group.mapper.toResponse', () => {
  it('should map account-group to response format', () => {
    const accountGroup: AccountGroupDocument = {
      _id: 'test-id',
      accountId: 'account-123',
      groupId: 'group-456',
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      updatedAt: new Date('2023-01-02T00:00:00.000Z'),
    };

    const response = accountGroupMapper.toResponse(accountGroup);

    expect(response).toEqual({
      _id: 'test-id',
      accountId: 'account-123',
      groupId: 'group-456',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    });
  });

  it('should handle different account-group data', () => {
    const accountGroup: AccountGroupDocument = {
      _id: 'test-id-2',
      accountId: 'account-789',
      groupId: 'group-012',
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      updatedAt: new Date('2023-01-02T00:00:00.000Z'),
    };

    const response = accountGroupMapper.toResponse(accountGroup);

    expect(response).toEqual({
      _id: 'test-id-2',
      accountId: 'account-789',
      groupId: 'group-012',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    });
  });
});
