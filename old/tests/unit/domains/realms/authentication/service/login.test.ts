import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authenticationService from '@/domains/realms/authentication/authentication.service';
import * as accountService from '@/domains/realms/accounts/account.service';
import { getTenantId } from '@test/utils/tenant.util';

describe('authentication.service.login - error handling', () => {
  let tenantId: string;

  beforeEach(async () => {
    tenantId = await getTenantId('vi-test-db-auth-error');
  });

  it('should rethrow unexpected errors', async () => {
    const findByEmailSpy = vi
      .spyOn(accountService, 'findByEmail')
      .mockRejectedValueOnce(new Error('Database connection failed'));

    await expect(
      authenticationService.login(tenantId, {
        email: 'test@example.com',
        password: 'Password123!',
      })
    ).rejects.toThrow('Database connection failed');

    findByEmailSpy.mockRestore();
  });
});
