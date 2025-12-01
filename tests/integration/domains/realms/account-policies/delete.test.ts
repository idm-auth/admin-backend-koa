import { ErrorResponse } from '@/domains/commons/base/base.schema';
import { AccountBaseResponse } from '@/domains/realms/accounts/account.schema';
import { PolicyBaseResponse } from '@/domains/realms/policies/policy.schema';
import { getTenantId } from '@test/utils/tenant.util';
import { generateTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { beforeAll, describe, expect, it } from 'vitest';

describe('DELETE /api/realm/:tenantId/account-policies', () => {
  let tenantId: string;
  let accountId: string;
  let policyId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-account-policies-delete');

    const accountResponse = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .send({
        email: generateTestEmail('test'), // Test credential - not production
        password: TEST_PASSWORD, // Test credential - not production
      })
      .expect(201);
    const account: AccountBaseResponse = accountResponse.body;
    accountId = account._id;

    const policyResponse = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/policies`)
      .send({
        version: '1',
        name: `test-policy-${uuidv4()}`,
        effect: 'Allow',
        actions: ['iam:accounts:read'],
        resources: ['grn:global:iam::${tenantId}:accounts/*'],
      })
      .expect(201);
    const policy: PolicyBaseResponse = policyResponse.body;
    policyId = policy._id;
  });

  it('should delete account-policy relationship successfully', async () => {
    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-policies`)
      .send({ accountId, policyId })
      .expect(201);

    await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/account-policies`)
      .send({ accountId, policyId })
      .expect(204);
  });

  it('should return 404 when deleting non-existent relationship', async () => {
    const nonExistentAccountId = uuidv4();

    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/account-policies`)
      .send({ accountId: nonExistentAccountId, policyId })
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 400 for invalid accountId format', async () => {
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/account-policies`)
      .send({ accountId: 'invalid-id', policyId })
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });
});
