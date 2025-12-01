import { ErrorResponse } from '@/domains/commons/base/base.schema';
import { PolicyBaseResponse } from '@/domains/realms/policies/policy.schema';
import { RoleBaseResponse } from '@/domains/realms/roles/role.schema';
import { getTenantId } from '@test/utils/tenant.util';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { beforeAll, describe, expect, it } from 'vitest';

describe('DELETE /api/realm/:tenantId/role-policies', () => {
  let tenantId: string;
  let roleId: string;
  let policyId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-role-policies-delete');

    const roleResponse = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/roles`)
      .send({ name: `test-role-${uuidv4()}` })
      .expect(201);
    const role: RoleBaseResponse = roleResponse.body;
    roleId = role._id;

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

  it('should delete role-policy relationship successfully', async () => {
    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/role-policies`)
      .send({ roleId, policyId })
      .expect(201);

    await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/role-policies`)
      .send({ roleId, policyId })
      .expect(204);
  });

  it('should return 404 when deleting non-existent relationship', async () => {
    const nonExistentRoleId = uuidv4();

    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/role-policies`)
      .send({ roleId: nonExistentRoleId, policyId })
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 400 for invalid roleId format', async () => {
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/role-policies`)
      .send({ roleId: 'invalid-id', policyId })
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });
});
