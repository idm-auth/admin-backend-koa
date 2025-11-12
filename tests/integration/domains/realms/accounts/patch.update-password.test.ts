import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import * as accountService from '@/domains/realms/accounts/account.service';

describe('PATCH /api/realm/:tenantId/accounts/:id/update-password', () => {
  let tenantId: string;
  let accountId: string;

  const getApp = () => globalThis.testKoaApp;
  const CURRENT_PASSWORD = 'Password123!';
  const NEW_PASSWORD = 'NewPassword456!';

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-update-password');

    // Criar uma conta para testar o update usando service
    const account = await accountService.create(tenantId, {
      email: 'updatepasstest@example.com',
      password: CURRENT_PASSWORD,
    });
    accountId = account._id;
  });

  it('should update password successfully', async () => {
    const updateData = {
      currentPassword: CURRENT_PASSWORD,
      newPassword: NEW_PASSWORD,
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/update-password`)
      .send(updateData)
      .expect(200);

    expect(response.body).toHaveProperty('_id', accountId);
    expect(response.body).toHaveProperty('email', 'updatepasstest@example.com');
    expect(response.body).not.toHaveProperty('password');
  });

  it('should return 400 for missing currentPassword', async () => {
    const updateData = {
      newPassword: NEW_PASSWORD,
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/update-password`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Password is required');
  });

  it('should return 400 for missing newPassword', async () => {
    const updateData = {
      currentPassword: NEW_PASSWORD, // Usando a nova senha como atual
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/update-password`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Password is required');
  });

  it('should return 404 for incorrect current password', async () => {
    const updateData = {
      currentPassword: 'WrongPassword123!',
      newPassword: 'AnotherPassword789!',
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/update-password`)
      .send(updateData)
      .expect(404);

    expect(response.body).toHaveProperty(
      'error',
      'Current password is incorrect'
    );
  });

  it('should return 400 for weak new password', async () => {
    const updateData = {
      currentPassword: NEW_PASSWORD, // Usando a nova senha como atual
      newPassword: 'weak',
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${accountId}/update-password`)
      .send(updateData)
      .expect(400);

    expect(response.body.error).toMatch(/Password must/);
  });

  it('should return 404 for non-existent account', async () => {
    const nonExistentId = uuidv4();
    const updateData = {
      currentPassword: CURRENT_PASSWORD,
      newPassword: NEW_PASSWORD,
    };

    const response = await request(getApp().callback())
      .patch(
        `/api/realm/${tenantId}/accounts/${nonExistentId}/update-password`
      )
      .send(updateData)
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Account not found');
  });

  it('should return 400 for invalid account ID format', async () => {
    const invalidId = 'invalid-uuid';
    const updateData = {
      currentPassword: CURRENT_PASSWORD,
      newPassword: NEW_PASSWORD,
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/accounts/${invalidId}/update-password`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Invalid ID');
  });
});
