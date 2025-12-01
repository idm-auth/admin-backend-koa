import { ErrorResponse } from '@/domains/commons/base/base.schema';
import { GroupBaseResponse } from '@/domains/realms/groups/group.schema';
import { PolicyBaseResponse } from '@/domains/realms/policies/policy.schema';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { beforeAll, describe, expect, it } from 'vitest';

describe('DELETE /api/realm/:tenantId/group-policies', () => {
  let tenantId: string;
  let groupId: string;
  let policyId: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-group-policies-delete');
    authToken = await getAuthToken(tenantId, 'group-policies.delete.test');

    const groupResponse = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/groups`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ name: `test-group-${uuidv4()}` })
      .expect(201);
    const group: GroupBaseResponse = groupResponse.body;
    groupId = group._id;

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
  });

  it('should delete group-policy relationship successfully', async () => {
    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/group-policies`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ groupId, policyId })
      .expect(201);

    await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/group-policies`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ groupId, policyId })
      .expect(204);
  });

  it('should return 404 when deleting non-existent relationship', async () => {
    const nonExistentGroupId = uuidv4();

    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/group-policies`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ groupId: nonExistentGroupId, policyId })
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 400 for invalid groupId format', async () => {
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/group-policies`)
      .set('Authorization', `Bearer ${authToken}`) // Test credential - not production - qdeveloper bug - do not remove
      .send({ groupId: 'invalid-id', policyId })
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });
});
