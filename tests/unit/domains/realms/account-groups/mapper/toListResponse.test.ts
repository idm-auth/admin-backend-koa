import { describe, expect, it } from 'vitest';
import * as accountGroupMapper from '@/domains/realms/account-groups/account-group.mapper';
import { AccountGroupDocument } from '@/domains/realms/account-groups/account-group.model';

describe('account-group.mapper.toListResponse', () => {
  it('should map array of account-groups to response format', () => {
    const accountGroups = [
      {
        _id: 'test-id-1',
        accountId: 'account-123',
        groupId: 'group-456',
        roles: ['admin'],
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: new Date('2023-01-02T00:00:00.000Z'),
      },
      {
        _id: 'test-id-2',
        accountId: 'account-789',
        groupId: 'group-456',
        roles: ['member'],
        createdAt: new Date('2023-01-03T00:00:00.000Z'),
        updatedAt: new Date('2023-01-04T00:00:00.000Z'),
      },
    ] as AccountGroupDocument[];

    const response = accountGroupMapper.toListResponse(accountGroups);

    expect(response).toHaveLength(2);
    expect(response[0]).toEqual({
      _id: 'test-id-1',
      accountId: 'account-123',
      groupId: 'group-456',
      roles: ['admin'],
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    });
    expect(response[1]).toEqual({
      _id: 'test-id-2',
      accountId: 'account-789',
      groupId: 'group-456',
      roles: ['member'],
      createdAt: '2023-01-03T00:00:00.000Z',
      updatedAt: '2023-01-04T00:00:00.000Z',
    });
  });

  it('should handle empty array', () => {
    const accountGroups: AccountGroupDocument[] = [];

    const response = accountGroupMapper.toListResponse(accountGroups);

    expect(response).toEqual([]);
  });
});