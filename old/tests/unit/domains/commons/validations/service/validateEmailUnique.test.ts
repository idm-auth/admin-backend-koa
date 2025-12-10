import { describe, it, expect, beforeAll } from 'vitest';
import { validateEmailUnique } from '@/domains/commons/validations/validation.service';
import { ValidationError } from '@/errors/validation';
import * as accountService from '@/domains/realms/accounts/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import { createTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';

describe('validation.service.validateEmailUnique', () => {
  let tenantId: string;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-validation');
  });

  it('should throw ValidationError when email already exists', async () => {
    const email = createTestEmail('duplicate');
    await accountService.create(tenantId, { email, password: TEST_PASSWORD });

    await expect(validateEmailUnique(tenantId, email)).rejects.toThrow(
      ValidationError
    );
  });

  it('should not throw when email does not exist', async () => {
    const email = createTestEmail('unique');
    await expect(validateEmailUnique(tenantId, email)).resolves.toBeUndefined();
  });
});
