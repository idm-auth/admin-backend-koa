import { describe, expect, it } from 'vitest';
import * as accountMapper from '@/domains/realms/accounts/account.mapper';
import { AccountDocument } from '@/domains/realms/accounts/account.model';
import { createTestEmail } from '@test/utils/test-constants';

describe('account.mapper.toCreateResponse', () => {
  const accountWithPrimary: AccountDocument = {
    _id: 'test-id',
    emails: [
      { email: createTestEmail('primary'), isPrimary: true }, // Test email - not production
      { email: createTestEmail('secondary'), isPrimary: false }, // Test email - not production
    ],
  };

  const accountNoPrimary: AccountDocument = {
    _id: 'test-id',
    emails: [
      { email: createTestEmail('first'), isPrimary: false }, // Test email - not production
      { email: createTestEmail('second'), isPrimary: false }, // Test email - not production
    ],
  };

  const accountNoEmails: AccountDocument = {
    _id: 'test-id',
    emails: [],
  };

  it('should return primary email when exists', () => {
    const result = accountMapper.toCreateResponse(accountWithPrimary);

    expect(result).toEqual({
      _id: 'test-id',
      email: createTestEmail('primary'),
      isPrimary: true,
    });
  });

  it('should return first email when no primary exists', () => {
    const result = accountMapper.toCreateResponse(accountNoPrimary);

    expect(result).toEqual({
      _id: 'test-id',
      email: createTestEmail('first'),
      isPrimary: false,
    });
  });

  it('should throw error when no emails exist', () => {
    expect(() => {
      accountMapper.toCreateResponse(accountNoEmails);
    }).toThrow('Account must have at least one email');
  });

  it('should throw error when email data is invalid', () => {
    const accountWithInvalidEmail = {
      _id: 'test-id',
      emails: [{ email: null, isPrimary: true }],
    } as { _id: string; emails: { email: null; isPrimary: boolean }[] };

    expect(() =>
      accountMapper.toCreateResponse(accountWithInvalidEmail)
    ).toThrow('Invalid email data in account');
  });
});
