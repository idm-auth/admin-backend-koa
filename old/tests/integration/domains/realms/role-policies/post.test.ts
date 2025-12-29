import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { v4 as uuidv4 } from 'uuid';
import { RoleBaseResponse } from '@/domains/realms/roles/role.schema';
import { PolicyBaseResponse } from '@/domains/realms/policies/policy.schema';
import { RolePolicyBaseResponse } from '@/domains/realms/role-policies/role-policy.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('POST /api/realm/:tenantId/role-policies', () => {
  let tenantId: string;
  let roleId: string;
  let policyId: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-role-policies-post');
    authToken = await getAuthToken(tenantId, 'role-policies.post.test');

    const roleResponse = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/roles`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({
        name: `test-role-${uuidv4()}`,
        description: 'Test role',
      })
      .expect(201);
    const role: RoleBaseResponse = roleResponse.body;
    roleId = role._id;

    const policyResponse = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/policies`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({
        version: '2025-12-24',
        name: `test-policy-${uuidv4()}`,
        effect: 'Allow',
        actions: ['iam:accounts:read'],
        resources: ['grn:global:iam::${tenantId}:accounts/*'],
      })
      .expect(201);
    const policy: PolicyBaseResponse = policyResponse.body;
    policyId = policy._id;
  });

  it('should create role-policy relationship successfully', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/role-policies`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ roleId, policyId })
      .expect(201);

    const rolePolicy: RolePolicyBaseResponse = response.body;

    expect(rolePolicy).toHaveProperty('_id');
    expect(rolePolicy.roleId).toBe(roleId);
    expect(rolePolicy.policyId).toBe(policyId);
    expect(rolePolicy).toHaveProperty('createdAt');
    expect(rolePolicy).toHaveProperty('updatedAt');
  });

  it('should return 400 for missing roleId', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/role-policies`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ policyId })
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 400 for missing policyId', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/role-policies`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ roleId })
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 400 for invalid roleId format', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/role-policies`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ roleId: 'invalid-id', policyId })
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });
});
