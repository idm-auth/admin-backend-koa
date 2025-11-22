import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import { getTenantId } from '@test/utils/tenant.util';
import * as policyService from '@/domains/realms/policies/policy.service';

describe('PUT /api/realm/:tenantId/policies/:id', () => {
  let tenantId: string;
  let createdPolicyId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-policy-put');

    const policy = await policyService.create(tenantId, {
      name: 'Test Policy Update',
      description: 'Policy for PUT test',
      effect: 'Allow',
      actions: ['read'],
      resources: ['resource1'],
    });
    createdPolicyId = policy._id;
  });

  it('should update policy successfully', async () => {
    const updateData = {
      name: 'Updated Policy Name',
      description: 'Updated description',
      effect: 'Deny',
      actions: ['read', 'write'],
      resources: ['resource1', 'resource2'],
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/policies/${createdPolicyId}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toHaveProperty('_id', createdPolicyId);
    expect(response.body.name).toBe(updateData.name);
    expect(response.body.effect).toBe(updateData.effect);
    expect(response.body.actions).toEqual(updateData.actions);
  });

  it('should update partial fields', async () => {
    const partialUpdate = {
      description: 'Partially updated description',
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/policies/${createdPolicyId}`)
      .send(partialUpdate)
      .expect(200);

    expect(response.body.description).toBe(partialUpdate.description);
    expect(response.body.name).toBe('Updated Policy Name');
  });

  it('should return 404 for non-existent policy', async () => {
    const nonExistentId = uuidv4();

    await request(getApp().callback())
      .put(`/api/realm/${tenantId}/policies/${nonExistentId}`)
      .send({ name: 'Updated Name' })
      .expect(404);
  });

  it('should return 400 for invalid ID format', async () => {
    await request(getApp().callback())
      .put(`/api/realm/${tenantId}/policies/invalid-id`)
      .send({ name: 'Updated Name' })
      .expect(400);
  });
});
