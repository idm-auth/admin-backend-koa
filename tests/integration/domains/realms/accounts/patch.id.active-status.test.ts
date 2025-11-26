import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import { getTenantId } from '@test/utils/tenant.util';
import { TEST_PASSWORD, createTestEmail } from '@test/utils/test-constants';
import { AccountUpdateResponse } from '@/domains/realms/accounts/account.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('PATCH /api/realm/:tenantId/accounts/:id/active-status', () => {
  let tenantId: string;
  let accountId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-account-active-status');

    // Create account for testing
    const accountData = {
      email: createTestEmail('active-status'), // Test email - not production
      password: TEST_PASSWORD, // Test credential - not production
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
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
      .send(statusData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 400 for invalid isActive type', async () => {
    const statusData = {
      isActive: 'invalid',
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/active-status`)
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
      .send(statusData)
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Account not found');
  });
});