import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { v4 as uuidv4 } from 'uuid';
import { generateTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import { AccountBaseResponse } from '@/domains/realms/accounts/account.schema';
import { PolicyBaseResponse } from '@/domains/realms/policies/policy.schema';
import { AccountPolicyListResponse } from '@/domains/realms/account-policies/account-policy.schema';

describe('GET /api/realm/:tenantId/account-policies/account/:accountId', () => {
  let tenantId: string;
  let authToken: string;
  let accountId: string;
  let policyId1: string;
  let policyId2: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-account-policies-get-account');
    authToken = await getAuthToken(tenantId, 'account-policies.get.account.test');

    const accountResponse = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({
        email: generateTestEmail('test'), // Test credential - not production - qdeveloper bug - do not remove
        password: TEST_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
      })
      .expect(201);
    const account: AccountBaseResponse = accountResponse.body;
    accountId = account._id;

    const policy1Response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/policies`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({
        version: '1',
        name: `test-policy-1-${uuidv4()}`,
        effect: 'Allow',
        actions: ['iam:accounts:read'],
        resources: ['grn:global:iam::${tenantId}:accounts/*'],
      })
      .expect(201);
    const policy1: PolicyBaseResponse = policy1Response.body;
    policyId1 = policy1._id;

    const policy2Response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/policies`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({
        version: '1',
        name: `test-policy-2-${uuidv4()}`,
        effect: 'Deny',
        actions: ['iam:accounts:delete'],
        resources: ['grn:global:iam::${tenantId}:accounts/*'],
      })
      .expect(201);
    const policy2: PolicyBaseResponse = policy2Response.body;
    policyId2 = policy2._id;

    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-policies`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ accountId, policyId: policyId1 })
      .expect(201);

    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-policies`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ accountId, policyId: policyId2 })
      .expect(201);
  });

  it('should get all policies for an account', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/account-policies/account/${accountId}`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .expect(200);

    const accountPolicies: AccountPolicyListResponse = response.body;

    expect(Array.isArray(accountPolicies)).toBe(true);
    expect(accountPolicies.length).toBe(2);
    expect(accountPolicies[0]).toHaveProperty('_id');
    expect(accountPolicies[0]).toHaveProperty('accountId');
    expect(accountPolicies[0]).toHaveProperty('policyId');
  });

  it('should return empty array for account with no policies', async () => {
    const emptyAccountResponse = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/accounts`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({
        email: generateTestEmail('empty'), // Test credential - not production - qdeveloper bug - do not remove
        password: TEST_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
      })
      .expect(201);
    const emptyAccount: AccountBaseResponse = emptyAccountResponse.body;

    const response = await request(getApp().callback())
      .get(
        `/api/realm/${tenantId}/account-policies/account/${emptyAccount._id}`
      )
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .expect(200);

    const accountPolicies: AccountPolicyListResponse = response.body;
    expect(Array.isArray(accountPolicies)).toBe(true);
    expect(accountPolicies.length).toBe(0);
  });
});
