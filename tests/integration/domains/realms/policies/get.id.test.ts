import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import { getTenantId } from '@test/utils/tenant.util';
import * as policyService from '@/domains/realms/policies/policy.service';

describe('GET /api/realm/:tenantId/policies/:id', () => {
  let tenantId: string;
  let createdPolicyId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-policy-get');
    
    const policy = await policyService.create(tenantId, {
      name: 'Test Policy Get',
      description: 'Policy for GET test',
      effect: 'Allow',
      actions: ['read'],
      resources: ['resource1'],
    });
    createdPolicyId = policy._id;
  });

  it('should get policy by ID successfully', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/policies/${createdPolicyId}`)
      .expect(200);

    expect(response.body).toHaveProperty('_id', createdPolicyId);
    expect(response.body).toHaveProperty('name', 'Test Policy Get');
    expect(response.body).toHaveProperty('effect', 'Allow');
    expect(response.body.actions).toEqual(['read']);
  });

  it('should return 404 for non-existent policy', async () => {
    const nonExistentId = uuidv4();

    await request(getApp().callback())
      .get(`/api/realm/${tenantId}/policies/${nonExistentId}`)
      .expect(404);
  });

  it('should return 400 for invalid ID format', async () => {
    await request(getApp().callback())
      .get(`/api/realm/${tenantId}/policies/invalid-id`)
      .expect(400);
  });
});