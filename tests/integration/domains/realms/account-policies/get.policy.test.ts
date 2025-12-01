import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import { generateTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import { AccountBaseResponse } from '@/domains/realms/accounts/account.schema';
import { PolicyBaseResponse } from '@/domains/realms/policies/policy.schema';
import { AccountPolicyListResponse } from '@/domains/realms/account-policies/account-policy.schema';

describe('GET /api/realm/:tenantId/account-policies/policy/:policyId', () => {
  let tenantId: string;
  let policyId: string;
  let accountId1: string;
  let accountId2: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-account-policies-get-policy');

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

    const account1Response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .send({
        email: generateTestEmail('test1'), // Test credential - not production
        password: TEST_PASSWORD, // Test credential - not production
      })
      .expect(201);
    const account1: AccountBaseResponse = account1Response.body;
    accountId1 = account1._id;

    const account2Response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .send({
        email: generateTestEmail('test2'), // Test credential - not production
        password: TEST_PASSWORD, // Test credential - not production
      })
      .expect(201);
    const account2: AccountBaseResponse = account2Response.body;
    accountId2 = account2._id;

    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-policies`)
      .send({ accountId: accountId1, policyId })
      .expect(201);

    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-policies`)
      .send({ accountId: accountId2, policyId })
      .expect(201);
  });

  it('should get all accounts with a policy', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/account-policies/policy/${policyId}`)
      .expect(200);

    const policyAccounts: AccountPolicyListResponse = response.body;

    expect(Array.isArray(policyAccounts)).toBe(true);
    expect(policyAccounts.length).toBe(2);
    expect(policyAccounts[0]).toHaveProperty('_id');
    expect(policyAccounts[0]).toHaveProperty('accountId');
    expect(policyAccounts[0]).toHaveProperty('policyId');
  });
});
