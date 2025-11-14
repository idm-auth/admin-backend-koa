import { describe, expect, it } from 'vitest';
import * as accountMapper from '@/domains/realms/accounts/account.mapper';
import { AccountDocument } from '@/domains/realms/accounts/account.model';

describe('account.mapper.toCreateResponse', () => {
  const accountWithPrimary = {
    _id: 'test-id',
    emails: [
      { email: 'primary@example.com', isPrimary: true },
      { email: 'secondary@example.com', isPrimary: false },
    ],
  } as AccountDocument;

  const accountNoPrimary = {
    _id: 'test-id',
    emails: [
      { email: 'first@example.com', isPrimary: false },
      { email: 'second@example.com', isPrimary: false },
    ],
  } as AccountDocument;

  const accountNoEmails = {
    _id: 'test-id',
    emails: [],
  } as AccountDocument;

  it('should return primary email when exists', () => {
    const result = accountMapper.toCreateResponse(accountWithPrimary);

    expect(result).toEqual({
      _id: 'test-id',
      email: 'primary@example.com',
      isPrimary: true,
    });
  });

  it('should return first email when no primary exists', () => {
    const result = accountMapper.toCreateResponse(accountNoPrimary);

    expect(result).toEqual({
      _id: 'test-id',
      email: 'first@example.com',
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
