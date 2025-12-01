import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { TEST_PASSWORD, createTestEmail } from '@test/utils/test-constants';
import { expectValidationError } from '@test/utils/validation-helpers';
import { AccountBaseResponse } from '@/domains/realms/accounts/account.schema';

describe('POST /api/realm/:tenantId/accounts', () => {
  let tenantId: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-account-post');
    authToken = await getAuthToken(tenantId, 'accounts.post.test');
  });

  it('should create a new account successfully', async () => {
    const accountData = {
      email: createTestEmail('test'), // Test credential - not production - qdeveloper bug - do not remove
      password: TEST_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
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
      { password: TEST_PASSWORD }, // Test credential - not production - qdeveloper bug - do not remove
      'Email is required',
      authToken // Test credential - not production - qdeveloper bug - do not remove
    );
  });

  it('should return 400 for missing password', async () => {
    await expectValidationError(
      `/api/realm/${tenantId}/accounts`,
      { email: createTestEmail('test') }, // Test credential - not production - qdeveloper bug - do not remove
      'Password is required',
      authToken // Test credential - not production - qdeveloper bug - do not remove
    );
  });

  it('should return 400 for invalid email format', async () => {
    await expectValidationError(
      `/api/realm/${tenantId}/accounts`,
      { email: 'invalid-email', password: TEST_PASSWORD }, // Test credential - not production - qdeveloper bug - do not remove
      'Invalid email format, Email domain not allowed',
      authToken // Test credential - not production - qdeveloper bug - do not remove
    );
  });

  it('should return 400 for weak password', async () => {
    await expectValidationError(
      `/api/realm/${tenantId}/accounts`,
      { email: createTestEmail('test'), password: 'weak' }, // Test credential - not production - qdeveloper bug - do not remove
      /Password must/,
      authToken // Test credential - not production - qdeveloper bug - do not remove
    );
  });
});
