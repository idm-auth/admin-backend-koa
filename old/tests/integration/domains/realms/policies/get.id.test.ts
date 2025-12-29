import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { PolicyBaseResponse } from '@/domains/realms/policies/policy.schema';
import * as policyService from '@/domains/realms/policies/policy.service';

describe('GET /api/realm/:tenantId/policies/:id', () => {
  let tenantId: string;
  let policyId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-policies-get-id');

    const policy = await policyService.create(tenantId, {
      version: '2025-12-24',
      name: 'TestPolicy',
      description: 'Test policy for GET',
      effect: 'Allow',
      actions: ['iam:accounts:read'],
      resources: ['grn:global:iam::company-xyz:accounts/*'],
    });

    policyId = policy._id;
  });

  it('should get policy by id successfully', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/policies/${policyId}`)
      .expect(200);

    const policy: PolicyBaseResponse = response.body;

    expect(policy._id).toBe(policyId);
    expect(policy.name).toBe('TestPolicy');
    expect(policy.description).toBe('Test policy for GET');
    expect(policy.effect).toBe('Allow');
    expect(policy.actions).toEqual(['iam:accounts:read']);
    expect(policy.resources).toEqual([
      'grn:global:iam::company-xyz:accounts/*',
    ]);
    expect(policy).toHaveProperty('createdAt');
    expect(policy).toHaveProperty('updatedAt');
  });

  it('should return 404 for non-existent policy', async () => {
    const nonExistentId = '550e8400-e29b-41d4-a716-446655440000';

    await request(getApp().callback())
      .get(`/api/realm/${tenantId}/policies/${nonExistentId}`)
      .expect(404);
  });

  it('should return 400 for invalid id format', async () => {
    await request(getApp().callback())
      .get(`/api/realm/${tenantId}/policies/invalid-id`)
      .expect(400);
  });
});
