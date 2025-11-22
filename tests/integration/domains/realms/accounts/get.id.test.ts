import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import * as accountService from '@/domains/realms/accounts/account.service';
import { AccountBaseResponse } from '@/domains/realms/accounts/account.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';
import { TEST_PASSWORD, createTestEmail } from '@test/utils/test-constants';

describe('GET /api/realm/:tenantId/accounts/:id', () => {
  let tenantId: string;
  let createdAccountId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-account-get-id');

    // Criar uma conta para os testes usando service
    const account = await accountService.create(tenantId, {
      email: createTestEmail('findtest'), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production
    });
    createdAccountId = account._id;
  });

  it('should find account by id successfully', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/accounts/${createdAccountId}`)
      .expect(200);

    const accountResponse: AccountBaseResponse = response.body;
    expect(accountResponse).toHaveProperty('_id', createdAccountId);
    expect(accountResponse.emails).toHaveLength(1);
    expect(accountResponse).not.toHaveProperty('password');
  });

  it('should return 404 for non-existent account', async () => {
    const nonExistentId = uuidv4();

    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/accounts/${nonExistentId}`)
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Account not found');
  });

  it('should return 400 for invalid account id format', async () => {
    const invalidId = 'invalid-id';

    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/accounts/${invalidId}`)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Invalid ID');
  });
});
