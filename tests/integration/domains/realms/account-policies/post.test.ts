import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import { generateTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import { AccountBaseResponse } from '@/domains/realms/accounts/account.schema';
import { PolicyBaseResponse } from '@/domains/realms/policies/policy.schema';
import { AccountPolicyBaseResponse } from '@/domains/realms/account-policies/account-policy.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('POST /api/realm/:tenantId/account-policies', () => {
  let tenantId: string;
  let accountId: string;
  let policyId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-account-policies-post');

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

  it('should create account-policy relationship successfully', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-policies`)
      .send({ accountId, policyId })
      .expect(201);

    const accountPolicy: AccountPolicyBaseResponse = response.body;

    expect(accountPolicy).toHaveProperty('_id');
    expect(accountPolicy.accountId).toBe(accountId);
    expect(accountPolicy.policyId).toBe(policyId);
    expect(accountPolicy).toHaveProperty('createdAt');
    expect(accountPolicy).toHaveProperty('updatedAt');
  });

  it('should return 400 for missing accountId', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-policies`)
      .send({ policyId })
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 400 for missing policyId', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-policies`)
      .send({ accountId })
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 400 for invalid accountId format', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/account-policies`)
      .send({ accountId: 'invalid-id', policyId })
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });
});
