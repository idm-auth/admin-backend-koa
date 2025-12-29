import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { PolicyBaseResponse } from '@/domains/realms/policies/policy.schema';
import * as policyService from '@/domains/realms/policies/policy.service';

describe('PATCH /api/realm/:tenantId/policies/:id', () => {
  let tenantId: string;
  let policyId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-policies-patch');

    const policy = await policyService.create(tenantId, {
      version: '2025-12-24',
      name: 'OriginalPolicy',
      description: 'Original description',
      effect: 'Allow',
      actions: ['iam:accounts:read'],
      resources: ['grn:global:iam::company-xyz:accounts/*'],
    });

    policyId = policy._id;
  });

  it('should update policy name successfully', async () => {
    const updateData = {
      name: 'UpdatedPolicy',
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/policies/${policyId}`)
      .send(updateData)
      .expect(200);

    const policy: PolicyBaseResponse = response.body;

    expect(policy._id).toBe(policyId);
    expect(policy.name).toBe('UpdatedPolicy');
    expect(policy.description).toBe('Original description');
  });

  it('should update policy description', async () => {
    const updateData = {
      description: 'Updated description',
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/policies/${policyId}`)
      .send(updateData)
      .expect(200);

    const policy: PolicyBaseResponse = response.body;

    expect(policy.description).toBe('Updated description');
  });

  it('should update policy effect', async () => {
    const updateData = {
      effect: 'Deny' as const,
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/policies/${policyId}`)
      .send(updateData)
      .expect(200);

    const policy: PolicyBaseResponse = response.body;

    expect(policy.effect).toBe('Deny');
  });

  it('should update policy actions', async () => {
    const updateData = {
      actions: ['iam:accounts:*', 'iam:roles:read'],
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/policies/${policyId}`)
      .send(updateData)
      .expect(200);

    const policy: PolicyBaseResponse = response.body;

    expect(policy.actions).toEqual(updateData.actions);
  });

  it('should update policy resources', async () => {
    const updateData = {
      resources: ['grn:global:iam::company-xyz:*'],
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/policies/${policyId}`)
      .send(updateData)
      .expect(200);

    const policy: PolicyBaseResponse = response.body;

    expect(policy.resources).toEqual(updateData.resources);
  });

  it('should return 404 for non-existent policy', async () => {
    const nonExistentId = '550e8400-e29b-41d4-a716-446655440000';

    await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/policies/${nonExistentId}`)
      .send({ name: 'NewName' })
      .expect(404);
  });

  it('should return 409 for duplicate name', async () => {
    await policyService.create(tenantId, {
      version: '2025-12-24',
      name: 'ExistingPolicy',
      effect: 'Allow',
      actions: ['iam:accounts:read'],
      resources: ['grn:global:iam::company-xyz:accounts/*'],
    });

    await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/policies/${policyId}`)
      .send({ name: 'ExistingPolicy' })
      .expect(409);
  });
});
