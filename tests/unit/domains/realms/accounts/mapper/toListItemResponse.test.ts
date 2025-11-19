import { describe, expect, it } from 'vitest';
import * as accountMapper from '@/domains/realms/accounts/account.mapper';
import { AccountDocument } from '@/domains/realms/accounts/account.model';
import { createTestEmail } from '@test/utils/test-constants';

describe('account.mapper.toListItemResponse', () => {
  const accountWithPrimary = {
    _id: 'test-id',
    emails: [
      { email: createTestEmail('primary'), isPrimary: true }, // Test email - not production
      { email: createTestEmail('secondary'), isPrimary: false }, // Test email - not production
    ],
  } as AccountDocument;

  it('should return primary email when exists', () => {
    const result = accountMapper.toListItemResponse(accountWithPrimary);

    expect(result).toEqual({
      _id: 'test-id',
      email: createTestEmail('primary'),
      isPrimary: true,
    });
  });

  it('should throw error when email is undefined', () => {
    const accountWithUndefinedEmail = {
      _id: 'test-id',
      emails: [{ email: undefined, isPrimary: true }],
    } as any;

    expect(() =>
      accountMapper.toListItemResponse(accountWithUndefinedEmail)
    ).toThrow('Invalid email data in account');
  });
});
