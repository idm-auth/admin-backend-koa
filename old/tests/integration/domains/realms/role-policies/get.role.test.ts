import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { v4 as uuidv4 } from 'uuid';
import { RoleBaseResponse } from '@/domains/realms/roles/role.schema';
import { PolicyBaseResponse } from '@/domains/realms/policies/policy.schema';
import { RolePolicyListResponse } from '@/domains/realms/role-policies/role-policy.schema';

describe('GET /api/realm/:tenantId/role-policies/role/:roleId', () => {
  let tenantId: string;
  let roleId: string;
  let policyId1: string;
  let policyId2: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-role-policies-get-role');
    authToken = await getAuthToken(tenantId, 'role-policies.get.role.test');

    const roleResponse = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/roles`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ name: `test-role-${uuidv4()}` })
      .expect(201);
    const role: RoleBaseResponse = roleResponse.body;
    roleId = role._id;

    const policy1Response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/policies`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({
        version: '2025-12-24',
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
        version: '2025-12-24',
        name: `test-policy-2-${uuidv4()}`,
        effect: 'Deny',
        actions: ['iam:accounts:delete'],
        resources: ['grn:global:iam::${tenantId}:accounts/*'],
      })
      .expect(201);
    const policy2: PolicyBaseResponse = policy2Response.body;
    policyId2 = policy2._id;

    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/role-policies`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ roleId, policyId: policyId1 })
      .expect(201);

    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/role-policies`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ roleId, policyId: policyId2 })
      .expect(201);
  });

  it('should get all policies for a role', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/role-policies/role/${roleId}`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .expect(200);

    const rolePolicies: RolePolicyListResponse = response.body;

    expect(Array.isArray(rolePolicies)).toBe(true);
    expect(rolePolicies.length).toBe(2);
    expect(rolePolicies[0]).toHaveProperty('_id');
    expect(rolePolicies[0]).toHaveProperty('roleId');
    expect(rolePolicies[0]).toHaveProperty('policyId');
  });

  it('should return empty array for role with no policies', async () => {
    const emptyRoleResponse = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/roles`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ name: `empty-role-${uuidv4()}` })
      .expect(201);
    const emptyRole: RoleBaseResponse = emptyRoleResponse.body;

    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/role-policies/role/${emptyRole._id}`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .expect(200);

    const rolePolicies: RolePolicyListResponse = response.body;
    expect(Array.isArray(rolePolicies)).toBe(true);
    expect(rolePolicies.length).toBe(0);
  });
});
