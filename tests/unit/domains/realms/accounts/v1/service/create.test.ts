import { describe, expect, it } from 'vitest';
import { ValidationError } from '@/errors/validation';
import * as accountService from '@/domains/realms/accounts/v1/account.service';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account.service.create', () => {
  it('should throw ValidationError for duplicate email', async () => {
    const tenantId = await getTenantId('test-account-create-duplicate');
    const email = `test-${uuidv4()}@example.com`;
    
    await accountService.create(tenantId, {
      email,
      password: 'Password123!',
    });

    await expect(
      accountService.create(tenantId, {
        email,
        password: 'Password123!',
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should create account successfully', async () => {
    const tenantId = await getTenantId('test-account-create-success');
    const email = `test-${uuidv4()}@example.com`;
    
    const account = await accountService.create(tenantId, {
      email,
      password: 'Password123!',
    });
    
    expect(account).toHaveProperty('_id');
    expect(account.emails[0].email).toBe(email);
    expect(account.emails[0].isPrimary).toBe(true);
  });
});