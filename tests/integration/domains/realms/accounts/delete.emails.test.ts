import request from 'supertest';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import * as accountService from '@/domains/realms/accounts/account.service';
import { ErrorResponse } from '@/domains/commons/base/base.schema';
import { generateTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';

describe('POST /api/realm/:tenantId/accounts/:id/email/remove', () => {
  let tenantId: string;
  let accountId: string;
  let primaryEmail: string;
  let secondaryEmail: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-remove-email');
  });

  beforeEach(async () => {
    primaryEmail = generateTestEmail('primary'); // Test credential - not production
    secondaryEmail = generateTestEmail('secondary'); // Test credential - not production

    // Criar conta com email primário
    const account = await accountService.create(tenantId, {
      email: primaryEmail,
      password: TEST_PASSWORD, // Test credential - not production
    });
    accountId = account._id;

    // Adicionar email secundário
    await accountService.addEmail(tenantId, accountId, secondaryEmail);
  });

  it('should remove email successfully', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts/${accountId}/email/remove`)
      .set('Content-Type', 'application/json')
      .send({ email: secondaryEmail });

    console.log('Response status:', response.status);
    console.log('Response body:', response.body);
    console.log('TenantId:', tenantId);
    console.log('AccountId:', accountId);
    console.log('SecondaryEmail:', secondaryEmail);

    expect(response.status).toBe(200);
  });

  it('should return 400 for missing email', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts/${accountId}/email/remove`)
      .send({})
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Email is required');
  });

  it('should return 400 for removing the only email', async () => {
    // Remover email secundário primeiro para deixar apenas o principal
    await accountService.removeEmail(tenantId, accountId, secondaryEmail);

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts/${accountId}/email/remove`)
      .send({ email: primaryEmail })
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty(
      'error',
      'Cannot remove the only email from account'
    );
  });

  it('should return 404 for email not found in account', async () => {
    const nonExistentEmail = generateTestEmail('nonexistent'); // Test credential - not production

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts/${accountId}/email/remove`)
      .send({ email: nonExistentEmail })
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty(
      'error',
      'Email not found in this account'
    );
  });

  it('should return 400 for invalid email format', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts/${accountId}/email/remove`)
      .send({ email: 'invalid-email' })
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty(
      'error',
      'Invalid email format, Email domain not allowed'
    );
  });

  it('should return 404 for non-existent account', async () => {
    const nonExistentId = uuidv4();

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts/${nonExistentId}/email/remove`)
      .send({ email: secondaryEmail })
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Account not found');
  });

  it('should return 400 for invalid account ID format', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts/invalid-uuid/email/remove`)
      .send({ email: secondaryEmail })
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Invalid ID');
  });
});
