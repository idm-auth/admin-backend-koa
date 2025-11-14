import { describe, expect, it } from 'vitest';
import * as accountMapper from '@/domains/realms/accounts/account.mapper';
import { AccountDocument } from '@/domains/realms/accounts/account.model';

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

  it('should throw error when email is undefined', () => {
    const accountWithUndefinedEmail = {
      _id: 'test-id',
      emails: [{ email: undefined, isPrimary: true }],
    } as { _id: string; emails: { email: undefined; isPrimary: boolean }[] };

    expect(() =>
      accountMapper.toListItemResponse(accountWithUndefinedEmail)
    ).toThrow('Invalid email data in account');
  });
});
