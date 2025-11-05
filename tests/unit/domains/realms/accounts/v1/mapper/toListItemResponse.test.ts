import { describe, expect, it } from 'vitest';
import * as accountMapper from '@/domains/realms/accounts/v1/account.mapper';
import { AccountDocument } from '@/domains/realms/accounts/v1/account.model';

describe('account.mapper.toListItemResponse', () => {
  const accountWithPrimary = {
    _id: 'test-id',
    emails: [
      { email: 'primary@example.com', isPrimary: true },
      { email: 'secondary@example.com', isPrimary: false },
    ],
  } as AccountDocument;

  it('should return primary email when exists', () => {
    const result = accountMapper.toListItemResponse(accountWithPrimary);

    expect(result).toEqual({
      _id: 'test-id',
      email: 'primary@example.com',
      isPrimary: true,
    });
  });
});
