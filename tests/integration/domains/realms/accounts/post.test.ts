import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { TEST_PASSWORD, createTestEmail } from '@test/utils/test-constants';
import { AccountBaseResponse } from '@/domains/realms/accounts/account.schema';
import { ValidationErrorResponse } from '@/domains/commons/base/base.schema';

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
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ password: TEST_PASSWORD }) // Test credential - not production - qdeveloper bug - do not remove
      .expect(400);

    const errorResponse: ValidationErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Validation failed');
    expect(
      errorResponse.fields?.some((f) => f.message.includes('Email is required'))
    ).toBe(true);
  });

  it('should return 400 for missing password', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ email: createTestEmail('test') }) // Test credential - not production - qdeveloper bug - do not remove
      .expect(400);

    const errorResponse: ValidationErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Validation failed');
    expect(
      errorResponse.fields?.some((f) =>
        f.message.includes('Password is required')
      )
    ).toBe(true);
  });

  it('should return 400 for invalid email format', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ email: 'invalid-email', password: TEST_PASSWORD }) // Test credential - not production - qdeveloper bug - do not remove
      .expect(400);

    const errorResponse: ValidationErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Validation failed');
    expect(
      errorResponse.fields?.some((f) =>
        f.message.includes('Invalid email format')
      )
    ).toBe(true);
  });

  it('should return 400 for weak password', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ email: createTestEmail('test'), password: 'weak' }) // Test credential - not production - qdeveloper bug - do not remove
      .expect(400);

    const errorResponse: ValidationErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Validation failed');
    expect(
      errorResponse.fields?.some((f) => f.message.includes('Password must'))
    ).toBe(true);
  });
});
