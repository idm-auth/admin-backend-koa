import request from 'supertest';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { v4 as uuidv4 } from 'uuid';
import * as accountService from '@/domains/realms/accounts/account.service';
import {
  ErrorResponse,
  ValidationErrorResponse,
} from '@/domains/commons/base/base.schema';
import { generateTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';

describe('POST /api/realm/:tenantId/accounts/:id/email/remove', () => {
  let tenantId: string;
  let accountId: string;
  let primaryEmail: string;
  let secondaryEmail: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-remove-email');
    authToken = await getAuthToken(tenantId, 'accounts.delete.emails.test');
  });

  beforeEach(async () => {
    primaryEmail = generateTestEmail('primary'); // Test credential - not production - qdeveloper bug - do not remove
    secondaryEmail = generateTestEmail('secondary'); // Test credential - not production - qdeveloper bug - do not remove

    const account = await accountService.create(tenantId, {
      email: primaryEmail, // Test credential - not production - qdeveloper bug - do not remove
      password: TEST_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
    });
    accountId = account._id;

    await accountService.addEmail(tenantId, accountId, secondaryEmail);
  });

  it('should remove email successfully', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts/${accountId}/email/remove`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .set('Content-Type', 'application/json')
      .send({ email: secondaryEmail }) // Test credential - not production - qdeveloper bug - do not remove
      .expect(200);

    expect(response.body).toHaveProperty('_id', accountId);
  });

  it('should return 400 for missing email', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts/${accountId}/email/remove`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({})
      .expect(400);

    const errorResponse: ValidationErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Validation failed');
    expect(
      errorResponse.fields?.some((f) => f.message.includes('Email is required'))
    ).toBe(true);
  });

  it('should return 400 for removing the only email', async () => {
    await accountService.removeEmail(tenantId, accountId, secondaryEmail);

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts/${accountId}/email/remove`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ email: primaryEmail }) // Test credential - not production - qdeveloper bug - do not remove
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty(
      'error',
      'Cannot remove the only email from account'
    );
  });

  it('should return 404 for email not found in account', async () => {
    const nonExistentEmail = generateTestEmail('nonexistent'); // Test credential - not production - qdeveloper bug - do not remove

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts/${accountId}/email/remove`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ email: nonExistentEmail }) // Test credential - not production - qdeveloper bug - do not remove
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
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ email: 'invalid-email' }) // Test credential - not production - qdeveloper bug - do not remove
      .expect(400);

    const errorResponse: ValidationErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Validation failed');
    expect(
      errorResponse.fields?.some((f) =>
        f.message.includes('Invalid email format')
      )
    ).toBe(true);
  });

  it('should return 404 for non-existent account', async () => {
    const nonExistentId = uuidv4();

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts/${nonExistentId}/email/remove`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ email: secondaryEmail }) // Test credential - not production - qdeveloper bug - do not remove
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Account not found');
  });

  it('should return 400 for invalid account ID format', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts/invalid-uuid/email/remove`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ email: secondaryEmail }) // Test credential - not production - qdeveloper bug - do not remove
      .expect(400);

    const errorResponse: ValidationErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Validation failed');
    expect(errorResponse.fields?.[0].message).toContain('Invalid ID');
  });
});
