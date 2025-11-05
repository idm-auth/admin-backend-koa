import { describe, expect, it } from 'vitest';
import * as accountMapper from '@/domains/realms/accounts/v1/account.mapper';
import { AccountDocument } from '@/domains/realms/accounts/v1/account.model';

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

  it('should return empty email when no emails exist', () => {
    const result = accountMapper.toCreateResponse(accountNoEmails);
    
    expect(result).toEqual({
      _id: 'test-id',
      email: '',
      isPrimary: false,
    });
  });
});