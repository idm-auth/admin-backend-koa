import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { TEST_PASSWORD, createTestEmail } from '@test/utils/test-constants';
import { AccountUpdateResponse } from '@/domains/realms/accounts/account.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('PATCH /api/realm/:tenantId/accounts/:id/active-status', () => {
  let tenantId: string;
  let accountId: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-account-active-status');
    authToken = await getAuthToken(
      tenantId,
      'accounts.patch.id.active-status.test'
    );

    const accountData = {
      email: createTestEmail('active-status'), // Test credential - not production - qdeveloper bug - do not remove
      password: TEST_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(accountData)
      .expect(201);

    accountId = response.body._id;
  });

  it('should set account to inactive successfully', async () => {
    const statusData = {
      isActive: false,
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/active-status`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(statusData)
      .expect(200);

    const account: AccountUpdateResponse = response.body;

    expect(account).toHaveProperty('_id', accountId);
    expect(account).toHaveProperty('isActive', false);
    expect(account.emails).toHaveLength(1);
  });

  it('should set account to active successfully', async () => {
    const statusData = {
      isActive: true,
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/active-status`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(statusData)
      .expect(200);

    const account: AccountUpdateResponse = response.body;

    expect(account).toHaveProperty('_id', accountId);
    expect(account).toHaveProperty('isActive', true);
    expect(account.emails).toHaveLength(1);
  });

  it('should return 400 for missing isActive field', async () => {
    const statusData = {};

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/active-status`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(statusData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 400 for invalid isActive type', async () => {
    const statusData = {
      isActive: 'invalid', // Test credential - not production - qdeveloper bug - do not remove
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/active-status`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(statusData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 404 for non-existent account', async () => {
    const nonExistentId = uuidv4();
    const statusData = {
      isActive: false,
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${nonExistentId}/active-status`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send(statusData)
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Account not found');
  });
});
