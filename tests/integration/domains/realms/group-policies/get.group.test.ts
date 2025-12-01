import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { v4 as uuidv4 } from 'uuid';
import { GroupBaseResponse } from '@/domains/realms/groups/group.schema';
import { PolicyBaseResponse } from '@/domains/realms/policies/policy.schema';
import { GroupPolicyListResponse } from '@/domains/realms/group-policies/group-policy.schema';

describe('GET /api/realm/:tenantId/group-policies/group/:groupId', () => {
  let tenantId: string;
  let groupId: string;
  let policyId1: string;
  let policyId2: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-group-policies-get-group');
    authToken = await getAuthToken(tenantId, 'group-policies.get.group.test');

    const groupResponse = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/groups`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ name: `test-group-${uuidv4()}` })
      .expect(201);
    const group: GroupBaseResponse = groupResponse.body;
    groupId = group._id;

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
      .post(`/api/realm/${tenantId}/group-policies`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ groupId, policyId: policyId1 })
      .expect(201);

    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/group-policies`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ groupId, policyId: policyId2 })
      .expect(201);
  });

  it('should get all policies for a group', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/group-policies/group/${groupId}`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .expect(200);

    const groupPolicies: GroupPolicyListResponse = response.body;

    expect(Array.isArray(groupPolicies)).toBe(true);
    expect(groupPolicies.length).toBe(2);
    expect(groupPolicies[0]).toHaveProperty('_id');
    expect(groupPolicies[0]).toHaveProperty('groupId');
    expect(groupPolicies[0]).toHaveProperty('policyId');
  });

  it('should return empty array for group with no policies', async () => {
    const emptyGroupResponse = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/groups`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ name: `empty-group-${uuidv4()}` })
      .expect(201);
    const emptyGroup: GroupBaseResponse = emptyGroupResponse.body;

    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/group-policies/group/${emptyGroup._id}`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .expect(200);

    const groupPolicies: GroupPolicyListResponse = response.body;
    expect(Array.isArray(groupPolicies)).toBe(true);
    expect(groupPolicies.length).toBe(0);
  });
});
