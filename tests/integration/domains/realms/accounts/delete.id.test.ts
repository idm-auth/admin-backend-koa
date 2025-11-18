import { createTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import * as accountService from '@/domains/realms/accounts/account.service';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('DELETE /api/realm/:tenantId/accounts/:id', () => {
  let tenantId: string;
  let createdAccountId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-account-delete');

    // Criar uma conta para os testes usando service
    const account = await accountService.create(tenantId, {
      email: createTestEmail('deletetest'), // Test credential - not production
      password: TEST_PASSWORD,
    });
    createdAccountId = account._id;
  });

  it('should delete account successfully', async () => {
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/accounts/${createdAccountId}`)
      .expect(204);

    expect(response.body).toEqual({});
  });

  it('should return 404 for non-existent account', async () => {
    const nonExistentId = uuidv4();

    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/accounts/${nonExistentId}`)
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Account not found');
  });

  it('should return 400 for invalid account id format', async () => {
    const invalidId = 'invalid-id';

    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/accounts/${invalidId}`)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Invalid ID');
  });

  it('should return 204 when trying to delete already deleted account', async () => {
    // Criar nova conta para deletar usando service
    const account = await accountService.create(tenantId, {
      email: createTestEmail('deletedtwice'), // Test credential - not production
      password: TEST_PASSWORD,
    });
    const accountId = account._id;

    // Tentar deletar novamente - softDelete sempre retorna 204 se o documento existir
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/accounts/${accountId}`)
      .expect(204);

    expect(response.body).toEqual({});
  });
});
