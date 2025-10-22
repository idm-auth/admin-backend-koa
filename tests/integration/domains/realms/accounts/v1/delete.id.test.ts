import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('DELETE /api/realm/:tenantId/v1/accounts/:id', () => {
  let tenantId: string;
  let createdAccountId: string;

  const getApp = () => globalThis.testKoaApp;
  const TEST_PASSWORD = 'Password123!';

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-account-delete');

    // Criar uma conta para os testes
    const accountData = {
      email: 'deletetest@example.com',
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

  it('should delete account successfully', async () => {
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/v1/accounts/${createdAccountId}`)
      .expect(204);

    expect(response.body).toEqual({});
  });

  it('should return 404 for non-existent account', async () => {
    const nonExistentId = uuidv4();

    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/v1/accounts/${nonExistentId}`)
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Account not found');
  });

  it('should return 400 for invalid account id format', async () => {
    const invalidId = 'invalid-id';

    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/v1/accounts/${invalidId}`)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Validation failed');
    expect(response.body.details).toContain('Invalid ID');
  });

  it('should return 204 when trying to delete already deleted account', async () => {
    // Criar nova conta para deletar
    const accountData = {
      email: 'deletedtwice@example.com',
      password: TEST_PASSWORD,
    };

    const createResponse = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/accounts`)
      .send(accountData);

    const accountId = createResponse.body._id;

    // Deletar primeira vez
    await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/v1/accounts/${accountId}`)
      .expect(204);

    // Tentar deletar novamente - softDelete sempre retorna 204 se o documento existir
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/v1/accounts/${accountId}`)
      .expect(204);

    expect(response.body).toEqual({});
  });
});