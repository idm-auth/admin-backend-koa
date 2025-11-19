import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import * as accountService from '@/domains/realms/accounts/account.service';
import { AccountReadResponse } from '@/domains/realms/accounts/account.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';
import {
  createTestEmail,
  generateTestEmail,
  TEST_PASSWORD,
} from '@test/utils/test-constants';

describe('POST /api/realm/:tenantId/accounts/:id/email', () => {
  let tenantId: string;
  let accountId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-add-email');

    // Criar uma conta para testar adicionar email usando service
    const account = await accountService.create(tenantId, {
      email: createTestEmail('addemailtest'), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production
    });
    accountId = account._id;
  });

  it('should add email successfully', async () => {
    const emailData = {
      email: createTestEmail('secondary'), // Test credential - not production
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts/${accountId}/email`)
      .send(emailData)
      .expect(200);

    const emailResponse: AccountReadResponse = response.body;
    expect(emailResponse).toHaveProperty('_id', accountId);
    expect(emailResponse).toHaveProperty('email');
    expect(emailResponse).toHaveProperty('isPrimary');
    expect(emailResponse).not.toHaveProperty('password');
  });

  it('should return 400 for missing email', async () => {
    const emailData = {};

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts/${accountId}/email`)
      .send(emailData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Email is required');
  });

  it('should return 400 for invalid email format', async () => {
    const emailData = {
      email: 'invalid-email',
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts/${accountId}/email`)
      .send(emailData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty(
      'error',
      'Invalid email format, Email domain not allowed'
    );
  });

  it('should return 400 for duplicate email in same account', async () => {
    const emailData = {
      email: createTestEmail('secondary'), // Test credential - not production (duplicate test)
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts/${accountId}/email`)
      .send(emailData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Email already exists');
  });

  it('should return 400 for email already used by another account', async () => {
    // Criar outra conta usando service
    const otherAccount = await accountService.create(tenantId, {
      email: createTestEmail('other'), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production
    });

    // Tentar adicionar email da primeira conta na segunda
    const emailData = {
      email: createTestEmail('addemailtest'), // Test credential - not production
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts/${otherAccount._id}/email`)
      .send(emailData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse.error).toMatch(/Email already exists/);
  });

  it('should return 404 for non-existent account', async () => {
    const nonExistentId = uuidv4();
    const emailData = {
      email: generateTestEmail('newemail'), // Test credential - not production
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts/${nonExistentId}/email`)
      .send(emailData)
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Account not found');
  });

  it('should return 400 for invalid account ID format', async () => {
    const invalidId = 'invalid-uuid';
    const emailData = {
      email: generateTestEmail('newemail-invalid'), // Test credential - not production
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts/${invalidId}/email`)
      .send(emailData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Invalid ID');
  });
});
