import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { v4 as uuidv4 } from 'uuid';
import * as accountService from '@/domains/realms/accounts/account.service';
import { AccountBaseResponse } from '@/domains/realms/accounts/account.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';
import { createTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';

describe('PATCH /api/realm/:tenantId/accounts/:id/reset-password', () => {
  let tenantId: string;
  let accountId: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;
  const NEW_PASSWORD = 'NewPassword456!'; // Test credential - not production - qdeveloper bug - do not remove

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-reset-password');
    authToken = await getAuthToken(tenantId, 'accounts.patch.reset-password.test');

    const account = await accountService.create(tenantId, {
      email: createTestEmail('resettest'), // Test credential - not production - qdeveloper bug - do not remove
      password: TEST_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
    });
    accountId = account._id;
  });

  it('should reset password successfully', async () => {
    const resetData = {
      password: NEW_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/reset-password`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(resetData)
      .expect(200);

    const accountResponse: AccountBaseResponse = response.body;
    expect(accountResponse).toHaveProperty('_id', accountId);
    expect(accountResponse.emails).toHaveLength(1);
    expect(accountResponse.emails[0].email).toBe(createTestEmail('resettest'));
    expect(accountResponse).not.toHaveProperty('password');
  });

  it('should return 400 for missing password', async () => {
    const resetData = {};

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/reset-password`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(resetData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Password is required');
  });

  it('should return 400 for weak password', async () => {
    const resetData = {
      password: 'weak', // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/reset-password`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(resetData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse.error).toMatch(/Password must/);
  });

  it('should return 400 for password without uppercase', async () => {
    const resetData = {
      password: 'password123!', // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/reset-password`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(resetData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse.error).toBe(
      'Password must contain at least one uppercase letter'
    );
  });

  it('should return 400 for password without lowercase', async () => {
    const resetData = {
      password: 'PASSWORD123!', // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/reset-password`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(resetData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse.error).toBe(
      'Password must contain at least one lowercase letter'
    );
  });

  it('should return 400 for password without number', async () => {
    const resetData = {
      password: 'Password!', // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/reset-password`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(resetData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse.error).toBe(
      'Password must contain at least one number'
    );
  });

  it('should return 400 for password without special character', async () => {
    const resetData = {
      password: 'Password123', // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/reset-password`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(resetData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse.error).toBe(
      'Password must contain at least one special character'
    );
  });

  it('should return 404 for non-existent account', async () => {
    const nonExistentId = uuidv4();
    const resetData = {
      password: NEW_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${nonExistentId}/reset-password`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(resetData)
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Account not found');
  });

  it('should return 400 for invalid account ID format', async () => {
    const invalidId = 'invalid-uuid';
    const resetData = {
      password: NEW_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${invalidId}/reset-password`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(resetData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Invalid ID');
  });

  it('should return 400 for invalid tenant ID format', async () => {
    const invalidTenantId = 'invalid-uuid';
    const resetData = {
      password: NEW_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .patch(
        `/api/realm/${invalidTenantId}/accounts/${accountId}/reset-password`
      )
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(resetData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Invalid ID');
  });
});
