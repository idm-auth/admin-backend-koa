import { createTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { v4 as uuidv4 } from 'uuid';
import * as accountService from '@/domains/realms/accounts/account.service';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('DELETE /api/realm/:tenantId/accounts/:id', () => {
  let tenantId: string;
  let createdAccountId: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-account-delete');
    authToken = await getAuthToken(tenantId, 'accounts.delete.id.test');

    const account = await accountService.create(tenantId, {
      email: createTestEmail('deletetest'), // Test credential - not production - qdeveloper bug - do not remove
      password: TEST_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
    });
    createdAccountId = account._id;
  });

  it('should delete account successfully', async () => {
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/accounts/${createdAccountId}`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .expect(204);

    expect(response.body).toEqual({});
  });

  it('should return 404 for non-existent account', async () => {
    const nonExistentId = uuidv4();

    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/accounts/${nonExistentId}`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Account not found');
  });

  it('should return 400 for invalid account id format', async () => {
    const invalidId = 'invalid-id';

    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/accounts/${invalidId}`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Invalid ID');
  });

  it('should return 204 when trying to delete already deleted account', async () => {
    // Criar nova conta para deletar usando service
    const account = await accountService.create(tenantId, {
      email: createTestEmail('deletedtwice'), // Test credential - not production - qdeveloper bug - do not remove
      password: TEST_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
    });
    const accountId = account._id;

    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/accounts/${accountId}`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .expect(204);

    expect(response.body).toEqual({});
  });
});
