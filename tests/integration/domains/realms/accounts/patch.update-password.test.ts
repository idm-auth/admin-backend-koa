import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { v4 as uuidv4 } from 'uuid';
import * as accountService from '@/domains/realms/accounts/account.service';
import { AccountBaseResponse } from '@/domains/realms/accounts/account.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';
import { createTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';

describe('PATCH /api/realm/:tenantId/accounts/:id/update-password', () => {
  let tenantId: string;
  let accountId: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;
  const CURRENT_PASSWORD = TEST_PASSWORD; // Test credential - not production - qdeveloper bug - do not remove
  const NEW_PASSWORD = 'NewPassword456!'; // Test credential - not production - qdeveloper bug - do not remove

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-update-password');
    authToken = await getAuthToken(
      tenantId,
      'accounts.patch.update-password.test'
    );

    const account = await accountService.create(tenantId, {
      email: createTestEmail('updatepasstest'), // Test credential - not production - qdeveloper bug - do not remove
      password: CURRENT_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
    });
    accountId = account._id;
  });

  it('should update password successfully', async () => {
    const updateData = {
      currentPassword: CURRENT_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
      newPassword: NEW_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/update-password`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(updateData)
      .expect(200);

    const accountResponse: AccountBaseResponse = response.body;
    expect(accountResponse).toHaveProperty('_id', accountId);
    expect(accountResponse.emails).toHaveLength(1);
    expect(accountResponse.emails[0].email).toBe(
      createTestEmail('updatepasstest')
    );
    expect(accountResponse).not.toHaveProperty('password');
  });

  it('should return 400 for missing currentPassword', async () => {
    const updateData = {
      newPassword: NEW_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/update-password`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(updateData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Password is required');
  });

  it('should return 400 for missing newPassword', async () => {
    const updateData = {
      currentPassword: NEW_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/update-password`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(updateData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Password is required');
  });

  it('should return 404 for incorrect current password', async () => {
    const updateData = {
      currentPassword: 'WrongPassword123!', // Test credential - not production - qdeveloper bug - do not remove
      newPassword: 'AnotherPassword789!', // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/update-password`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(updateData)
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty(
      'error',
      'Current password is incorrect'
    );
  });

  it('should return 400 for weak new password', async () => {
    const updateData = {
      currentPassword: NEW_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
      newPassword: 'weak', // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/update-password`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(updateData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse.error).toMatch(/Password must/);
  });

  it('should return 404 for non-existent account', async () => {
    const nonExistentId = uuidv4();
    const updateData = {
      currentPassword: CURRENT_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
      newPassword: NEW_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${nonExistentId}/update-password`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(updateData)
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Account not found');
  });

  it('should return 400 for invalid account ID format', async () => {
    const invalidId = 'invalid-uuid';
    const updateData = {
      currentPassword: CURRENT_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
      newPassword: NEW_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${invalidId}/update-password`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(updateData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Invalid ID');
  });
});
