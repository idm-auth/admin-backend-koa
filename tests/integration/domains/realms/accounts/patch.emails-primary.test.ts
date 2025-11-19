import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import * as accountService from '@/domains/realms/accounts/account.service';
import { AccountReadResponse } from '@/domains/realms/accounts/account.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';
import { createTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';

describe('PATCH /api/realm/:tenantId/accounts/:id/email/primary', () => {
  let tenantId: string;
  let accountId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-primary-email');

    // Criar uma conta para testar definir email principal usando service
    const account = await accountService.create(tenantId, {
      email: createTestEmail('primaryemailtest'), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production
    });
    accountId = account._id;

    // Adicionar emails secundários usando service
    await accountService.addEmail(
      tenantId,
      accountId,
      createTestEmail('secondary1') // Test credential - not production
    );
    await accountService.addEmail(
      tenantId,
      accountId,
      createTestEmail('secondary2') // Test credential - not production
    );
  });

  it('should set primary email successfully', async () => {
    const emailData = {
      email: createTestEmail('secondary1'), // Test credential - not production
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/email/primary`)
      .send(emailData)
      .expect(200);

    const emailResponse: AccountReadResponse = response.body;
    expect(emailResponse).toHaveProperty('_id', accountId);
    expect(emailResponse).toHaveProperty(
      'email',
      createTestEmail('secondary1')
    );
    expect(emailResponse).toHaveProperty('isPrimary', true);
    expect(emailResponse).not.toHaveProperty('password');
  });

  it('should return 400 for missing email', async () => {
    const emailData = {};

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/email/primary`)
      .send(emailData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Email is required');
  });

  it('should return 404 for email not found in account', async () => {
    const emailData = {
      email: createTestEmail('nonexistent'), // Test credential - not production
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/email/primary`)
      .send(emailData)
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty(
      'error',
      'Email not found in this account'
    );
  });

  it('should return 400 for invalid email format', async () => {
    const emailData = {
      email: 'invalid-email',
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/email/primary`)
      .send(emailData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty(
      'error',
      'Invalid email format, Email domain not allowed'
    );
  });

  it('should set already primary email as primary (idempotent)', async () => {
    const emailData = {
      email: createTestEmail('secondary1'), // Test credential - not production (already primary)
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/email/primary`)
      .send(emailData)
      .expect(200);

    const emailResponse: AccountReadResponse = response.body;
    expect(emailResponse).toHaveProperty('_id', accountId);
    expect(emailResponse).toHaveProperty(
      'email',
      createTestEmail('secondary1')
    );
    expect(emailResponse).toHaveProperty('isPrimary', true);
  });

  it('should change primary email from one to another', async () => {
    const emailData = {
      email: createTestEmail('secondary2'), // Test credential - not production
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/email/primary`)
      .send(emailData)
      .expect(200);

    const emailResponse: AccountReadResponse = response.body;
    expect(emailResponse).toHaveProperty('_id', accountId);
    expect(emailResponse).toHaveProperty(
      'email',
      createTestEmail('secondary2')
    );
    expect(emailResponse).toHaveProperty('isPrimary', true);
  });

  it('should return 404 for non-existent account', async () => {
    const nonExistentId = uuidv4();
    const emailData = {
      email: createTestEmail('test'), // Test credential - not production
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${nonExistentId}/email/primary`)
      .send(emailData)
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Account not found');
  });

  it('should return 400 for invalid account ID format', async () => {
    const invalidId = 'invalid-uuid';
    const emailData = {
      email: createTestEmail('test'), // Test credential - not production
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${invalidId}/email/primary`)
      .send(emailData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Invalid ID');
  });
});
