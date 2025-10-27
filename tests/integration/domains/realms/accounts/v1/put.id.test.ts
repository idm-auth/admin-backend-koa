import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('PUT /api/realm/:tenantId/v1/accounts/:id', () => {
  let tenantId: string;
  let createdAccountId: string;

  const getApp = () => globalThis.testKoaApp;
  const TEST_PASSWORD = 'Password123!';

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-account-put');

    // Criar uma conta para os testes
    const accountData = {
      email: 'updatetest@example.com',
      password: TEST_PASSWORD,
    };

    const createResponse = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/accounts`)
      .send(accountData);

    if (createResponse.status === 201) {
      createdAccountId = createResponse.body._id;
      if (!createdAccountId) {
        throw new Error('Account created but no ID returned');
      }
    } else {
      throw new Error(
        `Failed to create test account: ${createResponse.status} - ${createResponse.body?.error || 'Unknown error'}`
      );
    }
  });

  it('should update account email successfully', async () => {
    const updateData = {
      email: 'updated@example.com',
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/v1/accounts/${createdAccountId}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toHaveProperty('_id', createdAccountId);
    expect(response.body.email).toBe(updateData.email);
    expect(response.body).not.toHaveProperty('password');
  });

  it('should update account password successfully', async () => {
    const updateData = {
      password: 'NewPassword123!',
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/v1/accounts/${createdAccountId}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toHaveProperty('_id', createdAccountId);
    expect(response.body).not.toHaveProperty('password');
  });

  it('should update both email and password successfully', async () => {
    const updateData = {
      email: 'fullyupdated@example.com',
      password: 'AnotherPassword123!',
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/v1/accounts/${createdAccountId}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toHaveProperty('_id', createdAccountId);
    expect(response.body.email).toBe(updateData.email);
    expect(response.body).not.toHaveProperty('password');
  });

  it('should return 404 for non-existent account', async () => {
    const nonExistentId = uuidv4();
    const updateData = {
      email: 'test@example.com',
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/v1/accounts/${nonExistentId}`)
      .send(updateData)
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Account not found');
  });

  it('should return 400 for invalid account id format', async () => {
    const invalidId = 'invalid-id';
    const updateData = {
      email: 'test@example.com',
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/v1/accounts/${invalidId}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Invalid ID');
  });

  it('should return 400 for invalid email format', async () => {
    const updateData = {
      email: 'invalid-email',
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/v1/accounts/${createdAccountId}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Invalid email format');
  });

  it('should return 400 for weak password', async () => {
    const updateData = {
      password: 'weak',
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/v1/accounts/${createdAccountId}`)
      .send(updateData)
      .expect(400);

    expect(response.body.error).toMatch(/Password must/);
  });
});
