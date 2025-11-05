import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import * as accountService from '@/domains/realms/accounts/v1/account.service';

describe('PATCH /api/realm/:tenantId/v1/accounts/:id/reset-password', () => {
  let tenantId: string;
  let accountId: string;

  const getApp = () => globalThis.testKoaApp;
  const TEST_PASSWORD = 'Password123!';
  const NEW_PASSWORD = 'NewPassword456!';

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-reset-password');

    // Criar uma conta para testar o reset usando service
    const account = await accountService.create(tenantId, {
      email: 'resettest@example.com',
      password: TEST_PASSWORD,
    });
    accountId = account._id;
  });

  it('should reset password successfully', async () => {
    const resetData = {
      password: NEW_PASSWORD,
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/v1/accounts/${accountId}/reset-password`)
      .send(resetData)
      .expect(200);

    expect(response.body).toHaveProperty('_id', accountId);
    expect(response.body).toHaveProperty('email', 'resettest@example.com');
    expect(response.body).not.toHaveProperty('password');
  });

  it('should return 400 for missing password', async () => {
    const resetData = {};

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/v1/accounts/${accountId}/reset-password`)
      .send(resetData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Password is required');
  });

  it('should return 400 for weak password', async () => {
    const resetData = {
      password: 'weak',
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/v1/accounts/${accountId}/reset-password`)
      .send(resetData)
      .expect(400);

    expect(response.body.error).toMatch(/Password must/);
  });

  it('should return 400 for password without uppercase', async () => {
    const resetData = {
      password: 'password123!',
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/v1/accounts/${accountId}/reset-password`)
      .send(resetData)
      .expect(400);

    expect(response.body.error).toBe(
      'Password must contain at least one uppercase letter'
    );
  });

  it('should return 400 for password without lowercase', async () => {
    const resetData = {
      password: 'PASSWORD123!',
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/v1/accounts/${accountId}/reset-password`)
      .send(resetData)
      .expect(400);

    expect(response.body.error).toBe(
      'Password must contain at least one lowercase letter'
    );
  });

  it('should return 400 for password without number', async () => {
    const resetData = {
      password: 'Password!',
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/v1/accounts/${accountId}/reset-password`)
      .send(resetData)
      .expect(400);

    expect(response.body.error).toBe(
      'Password must contain at least one number'
    );
  });

  it('should return 400 for password without special character', async () => {
    const resetData = {
      password: 'Password123',
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/v1/accounts/${accountId}/reset-password`)
      .send(resetData)
      .expect(400);

    expect(response.body.error).toBe(
      'Password must contain at least one special character'
    );
  });

  it('should return 404 for non-existent account', async () => {
    const nonExistentId = uuidv4();
    const resetData = {
      password: NEW_PASSWORD,
    };

    const response = await request(getApp().callback())
      .patch(
        `/api/realm/${tenantId}/v1/accounts/${nonExistentId}/reset-password`
      )
      .send(resetData)
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Account not found');
  });

  it('should return 400 for invalid account ID format', async () => {
    const invalidId = 'invalid-uuid';
    const resetData = {
      password: NEW_PASSWORD,
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/v1/accounts/${invalidId}/reset-password`)
      .send(resetData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Invalid ID');
  });

  it('should return 400 for invalid tenant ID format', async () => {
    const invalidTenantId = 'invalid-uuid';
    const resetData = {
      password: NEW_PASSWORD,
    };

    const response = await request(getApp().callback())
      .patch(
        `/api/realm/${invalidTenantId}/v1/accounts/${accountId}/reset-password`
      )
      .send(resetData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Invalid ID');
  });
});
