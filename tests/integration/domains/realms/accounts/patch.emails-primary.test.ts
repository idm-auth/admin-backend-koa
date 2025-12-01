import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { v4 as uuidv4 } from 'uuid';
import * as accountService from '@/domains/realms/accounts/account.service';
import { AccountReadResponse } from '@/domains/realms/accounts/account.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';
import { createTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';

describe('PATCH /api/realm/:tenantId/accounts/:id/email/primary', () => {
  let tenantId: string;
  let accountId: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-primary-email');
    authToken = await getAuthToken(tenantId, 'accounts.patch.emails-primary.test');

    const account = await accountService.create(tenantId, {
      email: createTestEmail('primaryemailtest'), // Test credential - not production - qdeveloper bug - do not remove
      password: TEST_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
    });
    accountId = account._id;

    await accountService.addEmail(
      tenantId,
      accountId,
      createTestEmail('secondary1') // Test credential - not production - qdeveloper bug - do not remove
    );
    await accountService.addEmail(
      tenantId,
      accountId,
      createTestEmail('secondary2') // Test credential - not production - qdeveloper bug - do not remove
    );
  });

  it('should set primary email successfully', async () => {
    const emailData = {
      email: createTestEmail('secondary1'), // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/email/primary`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(emailData)
      .expect(200);

    const emailResponse: AccountReadResponse = response.body;
    expect(emailResponse).toHaveProperty('_id', accountId);
    expect(emailResponse.emails).toHaveLength(3);
    const primaryEmail = emailResponse.emails.find((e) => e.isPrimary);
    expect(primaryEmail?.email).toBe(createTestEmail('secondary1'));
    expect(emailResponse).not.toHaveProperty('password');
  });

  it('should return 400 for missing email', async () => {
    const emailData = {};

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/email/primary`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(emailData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Email is required');
  });

  it('should return 404 for email not found in account', async () => {
    const emailData = {
      email: createTestEmail('nonexistent'), // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/email/primary`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
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
      email: 'invalid-email', // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/email/primary`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
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
      email: createTestEmail('secondary1'), // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/email/primary`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(emailData)
      .expect(200);

    const emailResponse: AccountReadResponse = response.body;
    expect(emailResponse).toHaveProperty('_id', accountId);
    expect(emailResponse.emails).toHaveLength(3);
    const primaryEmail = emailResponse.emails.find((e) => e.isPrimary);
    expect(primaryEmail?.email).toBe(createTestEmail('secondary1'));
  });

  it('should change primary email from one to another', async () => {
    const emailData = {
      email: createTestEmail('secondary2'), // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/email/primary`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(emailData)
      .expect(200);

    const emailResponse: AccountReadResponse = response.body;
    expect(emailResponse).toHaveProperty('_id', accountId);
    expect(emailResponse.emails).toHaveLength(3);
    const primaryEmail = emailResponse.emails.find((e) => e.isPrimary);
    expect(primaryEmail?.email).toBe(createTestEmail('secondary2'));
  });

  it('should return 404 for non-existent account', async () => {
    const nonExistentId = uuidv4();
    const emailData = {
      email: createTestEmail('test'), // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${nonExistentId}/email/primary`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(emailData)
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Account not found');
  });

  it('should return 400 for invalid account ID format', async () => {
    const invalidId = 'invalid-uuid';
    const emailData = {
      email: createTestEmail('test'), // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${invalidId}/email/primary`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(emailData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Invalid ID');
  });
});
