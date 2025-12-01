import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { v4 as uuidv4 } from 'uuid';
import { RoleBaseResponse } from '@/domains/realms/roles/role.schema';
import { PolicyBaseResponse } from '@/domains/realms/policies/policy.schema';
import { RolePolicyListResponse } from '@/domains/realms/role-policies/role-policy.schema';

describe('GET /api/realm/:tenantId/role-policies/policy/:policyId', () => {
  let tenantId: string;
  let policyId: string;
  let roleId1: string;
  let roleId2: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-role-policies-get-policy');
    authToken = await getAuthToken(tenantId, 'role-policies.get.policy.test');

    const policyResponse = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/policies`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
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

    const role1Response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/roles`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ name: `test-role-1-${uuidv4()}` })
      .expect(201);
    const role1: RoleBaseResponse = role1Response.body;
    roleId1 = role1._id;

    const role2Response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/roles`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ name: `test-role-2-${uuidv4()}` })
      .expect(201);
    const role2: RoleBaseResponse = role2Response.body;
    roleId2 = role2._id;

    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/role-policies`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ roleId: roleId1, policyId })
      .expect(201);

    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/role-policies`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ roleId: roleId2, policyId })
      .expect(201);
  });

  it('should get all roles with a policy', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/role-policies/policy/${policyId}`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .expect(200);

    const policyRoles: RolePolicyListResponse = response.body;

    expect(Array.isArray(policyRoles)).toBe(true);
    expect(policyRoles.length).toBe(2);
    expect(policyRoles[0]).toHaveProperty('_id');
    expect(policyRoles[0]).toHaveProperty('roleId');
    expect(policyRoles[0]).toHaveProperty('policyId');
  });
});
