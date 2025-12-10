import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { PolicyPaginatedResponse } from '@/domains/realms/policies/policy.schema';
import * as policyService from '@/domains/realms/policies/policy.service';

describe('GET /api/realm/:tenantId/policies', () => {
  let tenantId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-policies-list');

    await policyService.create(tenantId, {
      version: '2025-12-24',
      name: 'Policy1',
      effect: 'Allow',
      actions: ['iam:accounts:read'],
      resources: ['grn:global:iam::company-xyz:accounts/*'],
    });

    await policyService.create(tenantId, {
      version: '2025-12-24',
      name: 'Policy2',
      effect: 'Deny',
      actions: ['iam:accounts:delete'],
      resources: ['grn:global:iam::company-xyz:accounts/*'],
    });

    await policyService.create(tenantId, {
      version: '2025-12-24',
      name: 'Policy3',
      effect: 'Allow',
      actions: ['iam:roles:*'],
      resources: ['grn:global:iam::company-xyz:roles/*'],
    });
  });

  it('should list policies with default pagination', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/policies`)
      .expect(200);

    const result: PolicyPaginatedResponse = response.body;

    expect(result.data).toBeInstanceOf(Array);
    expect(result.data.length).toBeGreaterThanOrEqual(3);
    expect(result.pagination).toHaveProperty('page');
    expect(result.pagination).toHaveProperty('rowsPerPage');
    expect(result.pagination).toHaveProperty('total');
    expect(result.pagination).toHaveProperty('totalPages');
  });

  it('should list policies with custom page and limit', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/policies?page=1&limit=2`)
      .expect(200);

    const result: PolicyPaginatedResponse = response.body;

    expect(result.data.length).toBeLessThanOrEqual(2);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.rowsPerPage).toBe(2);
  });

  it('should return empty array for page beyond total', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/policies?page=999&limit=10`)
      .expect(200);

    const result: PolicyPaginatedResponse = response.body;

    expect(result.data).toEqual([]);
    expect(result.pagination.page).toBe(999);
  });

  it('should return policies with all required fields', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/policies`)
      .expect(200);

    const result: PolicyPaginatedResponse = response.body;
    const policy = result.data[0];

    expect(policy).toHaveProperty('_id');
    expect(policy).toHaveProperty('version');
    expect(policy).toHaveProperty('name');
    expect(policy).toHaveProperty('effect');
    expect(policy).toHaveProperty('actions');
    expect(policy).toHaveProperty('resources');
    expect(policy).toHaveProperty('createdAt');
    expect(policy).toHaveProperty('updatedAt');
  });
});
