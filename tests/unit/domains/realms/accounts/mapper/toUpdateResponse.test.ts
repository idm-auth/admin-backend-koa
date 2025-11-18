import { describe, expect, it } from 'vitest';
import * as accountMapper from '@/domains/realms/accounts/account.mapper';
import { AccountDocument } from '@/domains/realms/accounts/account.model';
import { createTestEmail } from '@test/utils/test-constants';

describe('account.mapper.toUpdateResponse', () => {
  const accountWithPrimary: AccountDocument = {
    _id: 'test-id',
    emails: [
      { email: createTestEmail('primary'), isPrimary: true }, // Test email - not production
      { email: createTestEmail('secondary'), isPrimary: false }, // Test email - not production
    ],
  };

  it('should return primary email when exists', () => {
    const result = accountMapper.toUpdateResponse(accountWithPrimary);

    expect(result).toEqual({
      _id: 'test-id',
      email: createTestEmail('primary'),
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
