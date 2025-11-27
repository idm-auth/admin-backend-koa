import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { TEST_PASSWORD, createTestEmail } from '@test/utils/test-constants';
import { expectValidationError } from '@test/utils/validation-helpers';
import { AccountBaseResponse } from '@/domains/realms/accounts/account.schema';

describe('POST /api/realm/:tenantId/accounts', () => {
  let tenantId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-account-post');
  });

  it('should create a new account successfully', async () => {
    const accountData = {
      email: createTestEmail('test'), // Test email - not production
      password: TEST_PASSWORD, // Test credential - not production
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .send(accountData)
      .expect(201);

    const account: AccountBaseResponse = response.body;

    expect(account).toHaveProperty('_id');
    expect(account.emails).toHaveLength(1);
    expect(account.emails[0].email).toBe(accountData.email);
    expect(account.emails[0].isPrimary).toBe(true);
    expect(account).not.toHaveProperty('password');
  });

  it('should return 400 for missing email', async () => {
    await expectValidationError(
      `/api/realm/${tenantId}/accounts`,
      { password: TEST_PASSWORD },
      'Email is required'
    );
  });

  it('should return 400 for missing password', async () => {
    await expectValidationError(
      `/api/realm/${tenantId}/accounts`,
      { email: createTestEmail('test') },
      'Password is required'
    );
  });

  it('should return 400 for invalid email format', async () => {
    await expectValidationError(
      `/api/realm/${tenantId}/accounts`,
      { email: 'invalid-email', password: TEST_PASSWORD },
      'Invalid email format, Email domain not allowed'
    );
  });

  it('should return 400 for weak password', async () => {
    await expectValidationError(
      `/api/realm/${tenantId}/accounts`,
      { email: createTestEmail('test'), password: 'weak' },
      /Password must/
    );
  });
});
