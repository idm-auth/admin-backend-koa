import request from 'supertest';
import { beforeAll, describe, it } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import { getTenantId } from '@test/utils/tenant.util';
import * as policyService from '@/domains/realms/policies/policy.service';

describe('DELETE /api/realm/:tenantId/policies/:id', () => {
  let tenantId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-policy-delete');
  });

  it('should delete policy successfully', async () => {
    const policy = await policyService.create(tenantId, {
      name: 'Policy to Delete',
      description: 'Policy for DELETE test',
      effect: 'Allow',
      actions: ['read'],
      resources: ['resource1'],
    });

    await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/policies/${policy._id}`)
      .expect(204);

    // Verify policy is deleted
    await request(getApp().callback())
      .get(`/api/realm/${tenantId}/policies/${policy._id}`)
      .expect(404);
  });

  it('should return 404 for non-existent policy', async () => {
    const nonExistentId = uuidv4();

    await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/policies/${nonExistentId}`)
      .expect(404);
  });

  it('should return 400 for invalid ID format', async () => {
    await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/policies/invalid-id`)
      .expect(400);
  });
});
