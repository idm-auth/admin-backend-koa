import * as policyService from '@/domains/realms/policies/policy.service';
import { getTenantId } from '@test/utils/tenant.util';
import request from 'supertest';
import { beforeAll, describe, it } from 'vitest';

describe('DELETE /api/realm/:tenantId/policies/:id', () => {
  let tenantId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-policies-delete');
  });

  it('should delete policy successfully', async () => {
    const policy = await policyService.create(tenantId, {
      version: '1',
      name: 'PolicyToDelete',
      effect: 'Allow',
      actions: ['iam:accounts:read'],
      resources: ['grn:global:iam::company-xyz:accounts/*'],
    });

    await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/policies/${policy._id}`)
      .expect(204);

    await request(getApp().callback())
      .get(`/api/realm/${tenantId}/policies/${policy._id}`)
      .expect(404);
  });

  it('should return 404 for non-existent policy', async () => {
    const nonExistentId = '550e8400-e29b-41d4-a716-446655440000';

    await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/policies/${nonExistentId}`)
      .expect(404);
  });

  it('should return 400 for invalid id format', async () => {
    await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/policies/invalid-id`)
      .expect(400);
  });
});
