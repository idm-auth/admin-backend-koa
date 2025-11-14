import * as accountService from '@/domains/realms/accounts/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import { describe, expect, it } from 'vitest';

describe('account.service.comparePassword', () => {
  it('should return true for matching password', async () => {
    const tenantId = await getTenantId('test-compare-password-true');
    const plainPassword = 'test-password';

    const account = await accountService.create(tenantId, {
      email: 'test@example.com',
      password: plainPassword,
    });

    const result = await accountService.comparePassword(account, plainPassword);

    expect(result).toBe(true);
  });

  it('should return false for non-matching password', async () => {
    const tenantId = await getTenantId('test-compare-password-false');
    const plainPassword = 'test-password';

    const account = await accountService.create(tenantId, {
      email: 'test2@example.com',
      password: plainPassword,
    });

    const result = await accountService.comparePassword(
      account,
      'wrong-password'
    );

    expect(result).toBe(false);
  });
});
