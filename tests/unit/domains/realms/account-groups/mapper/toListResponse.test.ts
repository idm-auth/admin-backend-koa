import { describe, it } from 'vitest';
import * as accountGroupMapper from '@/domains/realms/account-groups/account-group.mapper';
import {
  expectMapsArray,
  expectHandlesEmptyArray,
} from '@test/utils/mapper-test-helpers';
import { AccountGroupDocument } from '@/domains/realms/account-groups/account-group.model';

describe('account-group.mapper.toListResponse', () => {
  it('should map array of account-groups to response format', () => {
    expectMapsArray(
      accountGroupMapper.toListResponse,
      [
        {
          _id: 'test-id-1',
          accountId: 'account-123',
          groupId: 'group-456',
          createdAt: new Date('2023-01-01T00:00:00.000Z'),
          updatedAt: new Date('2023-01-02T00:00:00.000Z'),
        },
        {
          _id: 'test-id-2',
          accountId: 'account-789',
          groupId: 'group-456',
          createdAt: new Date('2023-01-03T00:00:00.000Z'),
          updatedAt: new Date('2023-01-04T00:00:00.000Z'),
        },
      ] as AccountGroupDocument[],
      [
        {
          _id: 'test-id-1',
          accountId: 'account-123',
          groupId: 'group-456',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-02T00:00:00.000Z',
        },
        {
          _id: 'test-id-2',
          accountId: 'account-789',
          groupId: 'group-456',
          createdAt: '2023-01-03T00:00:00.000Z',
          updatedAt: '2023-01-04T00:00:00.000Z',
        },
      ]
    );
  });

  it('should handle empty array', () => {
    expectHandlesEmptyArray(accountGroupMapper.toListResponse);
  });
});
