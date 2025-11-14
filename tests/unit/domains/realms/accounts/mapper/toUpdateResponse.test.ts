import { describe, expect, it } from 'vitest';
import * as accountMapper from '@/domains/realms/accounts/account.mapper';
import { AccountDocument } from '@/domains/realms/accounts/account.model';

describe('account.mapper.toUpdateResponse', () => {
  const accountWithPrimary = {
    _id: 'test-id',
    emails: [
      { email: 'primary@example.com', isPrimary: true },
      { email: 'secondary@example.com', isPrimary: false },
    ],
  } as AccountDocument;

  it('should return primary email when exists', () => {
    const result = accountMapper.toUpdateResponse(accountWithPrimary);

    expect(result).toEqual({
      _id: 'test-id',
      email: 'primary@example.com',
      isPrimary: true,
    });
  });

  it('should throw error when selectedEmail has no email property', () => {
    const accountWithEmptyEmailObject = {
      _id: 'test-id',
      emails: [{ isPrimary: true }],
    } as { _id: string; emails: { isPrimary: boolean }[] };

    expect(() =>
      accountMapper.toUpdateResponse(accountWithEmptyEmailObject)
    ).toThrow('Invalid email data in account');
  });
});
