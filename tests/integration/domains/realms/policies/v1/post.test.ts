import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';

describe('POST /api/realm/:tenantId/v1/policies', () => {
  let tenantId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-policy-post');
  });

  it('should create a new policy successfully', async () => {
    const policyData = {
      name: 'Test Policy',
      description: 'A test policy',
      effect: 'Allow',
      actions: ['read', 'write'],
      resources: ['resource1', 'resource2'],
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/policies`)
      .send(policyData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(policyData.name);
    expect(response.body.effect).toBe(policyData.effect);
    expect(response.body.actions).toEqual(policyData.actions);
    expect(response.body.resources).toEqual(policyData.resources);
  });

  it('should return 400 for missing required fields', async () => {
    const policyData = {
      name: 'Test Policy',
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/policies`)
      .send(policyData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Validation failed');
  });
});
