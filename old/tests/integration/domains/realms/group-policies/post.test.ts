import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { v4 as uuidv4 } from 'uuid';
import { GroupBaseResponse } from '@/domains/realms/groups/group.schema';
import { PolicyBaseResponse } from '@/domains/realms/policies/policy.schema';
import { GroupPolicyBaseResponse } from '@/domains/realms/group-policies/group-policy.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('POST /api/realm/:tenantId/group-policies', () => {
  let tenantId: string;
  let groupId: string;
  let policyId: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-group-policies-post');
    authToken = await getAuthToken(tenantId, 'group-policies.post.test');

    const groupResponse = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/groups`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({
        name: `test-group-${uuidv4()}`,
        description: 'Test group',
      })
      .expect(201);
    const group: GroupBaseResponse = groupResponse.body;
    groupId = group._id;

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

  it('should create group-policy relationship successfully', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/group-policies`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ groupId, policyId })
      .expect(201);

    const groupPolicy: GroupPolicyBaseResponse = response.body;

    expect(groupPolicy).toHaveProperty('_id');
    expect(groupPolicy.groupId).toBe(groupId);
    expect(groupPolicy.policyId).toBe(policyId);
    expect(groupPolicy).toHaveProperty('createdAt');
    expect(groupPolicy).toHaveProperty('updatedAt');
  });

  it('should return 400 for missing groupId', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/group-policies`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ policyId })
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 400 for missing policyId', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/group-policies`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ groupId })
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 400 for invalid groupId format', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/group-policies`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ groupId: 'invalid-id', policyId })
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });
});
