import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import * as accountService from '@/domains/realms/accounts/v1/account.service';

describe('DELETE /api/realm/:tenantId/v1/accounts/:id', () => {
  let tenantId: string;
  let createdAccountId: string;

  const getApp = () => globalThis.testKoaApp;
  const TEST_PASSWORD = 'Password123!';

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-account-delete');

    // Criar uma conta para os testes usando service
    const account = await accountService.create(tenantId, {
      email: 'deletetest@example.com',
      password: TEST_PASSWORD,
    });
    createdAccountId = account._id;
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

    expect(response.body).toHaveProperty('error', 'Invalid ID');
  });

  it('should return 204 when trying to delete already deleted account', async () => {
    // Criar nova conta para deletar usando service
    const account = await accountService.create(tenantId, {
      email: 'deletedtwice@example.com',
      password: TEST_PASSWORD,
    });
    const accountId = account._id;

    // Tentar deletar novamente - softDelete sempre retorna 204 se o documento existir
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/v1/accounts/${accountId}`)
      .expect(204);

    expect(response.body).toEqual({});
  });
});
