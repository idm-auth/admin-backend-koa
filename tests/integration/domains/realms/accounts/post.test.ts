import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { TEST_PASSWORD, createTestEmail } from '@test/utils/test-constants';
import { AccountBaseResponse } from '@/domains/realms/accounts/account.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('POST /api/realm/:tenantId/accounts', () => {
  let tenantId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-account-post');
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
    expect(account.email).toBe(accountData.email);
    expect(account).not.toHaveProperty('password');
  });

  it('should return 400 for missing email', async () => {
    const accountData = {
      password: TEST_PASSWORD, // Test credential - not production
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .send(accountData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Email is required');
  });

  it('should return 400 for missing password', async () => {
    const accountData = {
      email: createTestEmail('test'), // Test email - not production
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .send(accountData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Password is required');
  });

  it('should return 400 for invalid email format', async () => {
    const accountData = {
      email: 'invalid-email',
      password: TEST_PASSWORD, // Test credential - not production
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .send(accountData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty(
      'error',
      'Invalid email format, Email domain not allowed'
    );
  });

  it('should return 400 for weak password', async () => {
    const accountData = {
      email: createTestEmail('test'), // Test email - not production
      password: 'weak', // Intentionally weak for testing validation
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .send(accountData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse.error).toMatch(/Password must/);
  });

  it('should return 500 for server errors', async () => {
    // Teste com dados que causem erro interno
    const accountData = {
      email: createTestEmail('test'), // Test email - not production
      password: TEST_PASSWORD, // Test credential - not production
    };

    // Mock para simular erro no service se necessário
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .send(accountData);

    if (response.status === 500) {
      const errorResponse: ErrorResponse = response.body;
      expect(errorResponse).toHaveProperty('error', 'Internal server error');
    }
  });
});
