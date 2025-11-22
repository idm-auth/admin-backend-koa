import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import * as accountService from '@/domains/realms/accounts/account.service';
import { AccountBaseResponse } from '@/domains/realms/accounts/account.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';
import { createTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';

describe('PUT /api/realm/:tenantId/accounts/:id', () => {
  let tenantId: string;
  let createdAccountId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-account-put');

    // Criar uma conta para os testes usando service
    const account = await accountService.create(tenantId, {
      email: createTestEmail('updatetest'), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production
    });
    createdAccountId = account._id;
  });

  it('should update account successfully (no email/password change)', async () => {
    const updateData = {
      // Email e password não podem ser alterados via PUT
      // Usar métodos específicos para isso
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/accounts/${createdAccountId}`)
      .send(updateData)
      .expect(200);

    const accountResponse: AccountBaseResponse = response.body;
    expect(accountResponse).toHaveProperty('_id', createdAccountId);
    expect(accountResponse.emails).toHaveLength(1);
    expect(accountResponse).not.toHaveProperty('password');
  });

  it('should update account successfully (password ignored)', async () => {
    const updateData = {
      password: 'NewPassword123!', // Será ignorado
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/accounts/${createdAccountId}`)
      .send(updateData)
      .expect(200);

    const accountResponse: AccountBaseResponse = response.body;
    expect(accountResponse).toHaveProperty('_id', createdAccountId);
    expect(accountResponse).not.toHaveProperty('password');
  });

  it('should update account successfully (email and password ignored)', async () => {
    const updateData = {
      email: createTestEmail('fullyupdated'), // Test credential - not production (ignored)
      password: 'AnotherPassword456!', // Será ignorado
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/accounts/${createdAccountId}`)
      .send(updateData)
      .expect(200);

    const accountResponse: AccountBaseResponse = response.body;
    expect(accountResponse).toHaveProperty('_id', createdAccountId);
    expect(accountResponse.emails).toHaveLength(1); // Email original mantido
    expect(accountResponse).not.toHaveProperty('password');
  });

  it('should return 404 for non-existent account', async () => {
    const nonExistentId = uuidv4();
    const updateData = {
      email: createTestEmail('test'), // Test credential - not production
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/accounts/${nonExistentId}`)
      .send(updateData)
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Account not found');
  });

  it('should return 400 for invalid account id format', async () => {
    const invalidId = 'invalid-id';
    const updateData = {
      email: createTestEmail('test'), // Test credential - not production
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/accounts/${invalidId}`)
      .send(updateData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Invalid ID');
  });

  it('should return 200 for invalid email format (email ignored)', async () => {
    const updateData = {
      email: 'invalid-email', // Será ignorado
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/accounts/${createdAccountId}`)
      .send(updateData)
      .expect(200); // Não valida porque ignora o campo

    const accountResponse: AccountBaseResponse = response.body;
    expect(accountResponse).toHaveProperty('_id', createdAccountId);
  });

  it('should return 200 for weak password (password ignored)', async () => {
    const updateData = {
      password: 'weak', // Será ignorado
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/accounts/${createdAccountId}`)
      .send(updateData)
      .expect(200); // Não valida porque ignora o campo

    const accountResponse: AccountBaseResponse = response.body;
    expect(accountResponse).toHaveProperty('_id', createdAccountId);
  });
});
