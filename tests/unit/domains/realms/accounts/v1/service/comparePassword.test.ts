import { describe, expect, it } from 'vitest';
import bcrypt from 'bcrypt';
import * as accountService from '@/domains/realms/accounts/v1/account.service';

describe('account.service.comparePassword', () => {
  it('should return true for matching password', async () => {
    const plainPassword = 'test-password';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const account = { _id: 'account-id', password: hashedPassword } as any;
    
    const result = await accountService.comparePassword(account, plainPassword);
    
    expect(result).toBe(true);
  });

  it('should return false for non-matching password', async () => {
    const plainPassword = 'test-password';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const account = { _id: 'account-id', password: hashedPassword } as any;
    
    const result = await accountService.comparePassword(account, 'wrong-password');
    
    expect(result).toBe(false);
  });
});