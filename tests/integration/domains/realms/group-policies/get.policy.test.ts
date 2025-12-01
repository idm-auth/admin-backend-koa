import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import { GroupBaseResponse } from '@/domains/realms/groups/group.schema';
import { PolicyBaseResponse } from '@/domains/realms/policies/policy.schema';
import { GroupPolicyListResponse } from '@/domains/realms/group-policies/group-policy.schema';

describe('GET /api/realm/:tenantId/group-policies/policy/:policyId', () => {
  let tenantId: string;
  let policyId: string;
  let groupId1: string;
  let groupId2: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-group-policies-get-policy');

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

    const group1Response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/groups`)
      .send({ name: `test-group-1-${uuidv4()}` })
      .expect(201);
    const group1: GroupBaseResponse = group1Response.body;
    groupId1 = group1._id;

    const group2Response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/groups`)
      .send({ name: `test-group-2-${uuidv4()}` })
      .expect(201);
    const group2: GroupBaseResponse = group2Response.body;
    groupId2 = group2._id;

    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/group-policies`)
      .send({ groupId: groupId1, policyId })
      .expect(201);

    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/group-policies`)
      .send({ groupId: groupId2, policyId })
      .expect(201);
  });

  it('should get all groups with a policy', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/group-policies/policy/${policyId}`)
      .expect(200);

    const policyGroups: GroupPolicyListResponse = response.body;

    expect(Array.isArray(policyGroups)).toBe(true);
    expect(policyGroups.length).toBe(2);
    expect(policyGroups[0]).toHaveProperty('_id');
    expect(policyGroups[0]).toHaveProperty('groupId');
    expect(policyGroups[0]).toHaveProperty('policyId');
  });
});
