import { describe, expect, it } from 'vitest';
import { describe, expect, it } from 'vitest';
import { ValidationError } from '@/errors/validation';
import * as accountService from '@/domains/realms/accounts/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account.service.addEmail duplicate in account', () => {
  it('should throw ValidationError when email already exists', async () => {
    const tenantId = await getTenantId('test-add-email-duplicate-account');
    const email = `duplicate-${uuidv4()}@example.com`;
    
    const account = await accountService.create(tenantId, {
      email,
      password: 'Password123!',
    });

    await expect(
      accountService.addEmail(tenantId, account._id, email)
    ).rejects.toThrow(ValidationError);
  });
});