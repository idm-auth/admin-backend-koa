import { describe, expect, it } from 'vitest';
import * as accountMapper from '@/domains/realms/accounts/v1/account.mapper';

describe('account.mapper invalid email data', () => {
  it('should throw error when email data is invalid', () => {
    const accountWithInvalidEmail = {
      _id: 'test-id',
      emails: [{ email: null, isPrimary: true }], // Email inválido
    } as any;

    expect(() => accountMapper.toCreateResponse(accountWithInvalidEmail))
      .toThrow('Invalid email data in account');
  });

  it('should throw error when email is undefined', () => {
    const accountWithUndefinedEmail = {
      _id: 'test-id', 
      emails: [{ email: undefined, isPrimary: true }], // Email undefined
    } as any;

    expect(() => accountMapper.toListItemResponse(accountWithUndefinedEmail))
      .toThrow('Invalid email data in account');
  });

  it('should throw error when selectedEmail has no email property', () => {
    const accountWithEmptyEmailObject = {
      _id: 'test-id',
      emails: [{ isPrimary: true }], // Email object sem propriedade email
    } as any;

    expect(() => accountMapper.toUpdateResponse(accountWithEmptyEmailObject))
      .toThrow('Invalid email data in account');
  });
});