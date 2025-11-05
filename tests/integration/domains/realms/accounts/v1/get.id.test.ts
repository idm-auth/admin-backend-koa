import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import * as accountService from '@/domains/realms/accounts/v1/account.service';

describe('GET /api/realm/:tenantId/v1/accounts/:id', () => {
  let tenantId: string;
  let createdAccountId: string;

  const getApp = () => globalThis.testKoaApp;
  const TEST_PASSWORD = 'Password123!';

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-account-get-id');

    // Criar uma conta para os testes usando service
    const account = await accountService.create(tenantId, {
      email: 'findtest@example.com',
      password: TEST_PASSWORD,
    });
    createdAccountId = account._id;
  });

  it('should find account by id successfully', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/v1/accounts/${createdAccountId}`)
      .expect(200);

    expect(response.body).toHaveProperty('_id', createdAccountId);
    expect(response.body).toHaveProperty('email');
    expect(response.body).not.toHaveProperty('password');
  });

  it('should return 404 for non-existent account', async () => {
    const nonExistentId = uuidv4();

    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/v1/accounts/${nonExistentId}`)
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Account not found');
  });

  it('should return 400 for invalid account id format', async () => {
    const invalidId = 'invalid-id';

    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/v1/accounts/${invalidId}`)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Invalid ID');
  });
});
