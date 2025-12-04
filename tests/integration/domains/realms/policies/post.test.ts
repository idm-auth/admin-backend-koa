import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { getTenantId } from '@test/utils/tenant.util';
import { PolicyBaseResponse } from '@/domains/realms/policies/policy.schema';
import { ValidationErrorResponse } from '@/domains/commons/base/base.schema';

describe('POST /api/realm/:tenantId/policies', () => {
  let tenantId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-policies-post');
  });

  it('should create policy successfully', async () => {
    const policyData = {
      name: 'AdminFullAccess',
      description: 'Full access to all resources',
      effect: 'Allow' as const,
      actions: ['iam:*:*'],
      resources: ['grn:global:iam::company-xyz:*'],
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/policies`)
      .send(policyData)
      .expect(201);

    const policy: PolicyBaseResponse = response.body;

    expect(policy).toHaveProperty('_id');
    expect(policy.version).toBe('1');
    expect(policy.name).toBe(policyData.name);
    expect(policy.description).toBe(policyData.description);
    expect(policy.effect).toBe(policyData.effect);
    expect(policy.actions).toEqual(policyData.actions);
    expect(policy.resources).toEqual(policyData.resources);
    expect(policy).toHaveProperty('createdAt');
    expect(policy).toHaveProperty('updatedAt');
  });

  it('should create policy with Deny effect', async () => {
    const policyData = {
      name: 'DenyDelete',
      effect: 'Deny' as const,
      actions: ['*:*:delete'],
      resources: ['grn:global:*:*:company-xyz:*'],
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/policies`)
      .send(policyData)
      .expect(201);

    const policy: PolicyBaseResponse = response.body;

    expect(policy.effect).toBe('Deny');
    expect(policy.name).toBe(policyData.name);
  });

  it('should return 400 for missing name', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/policies`)
      .send({
        effect: 'Allow',
        actions: ['iam:accounts:read'],
        resources: ['grn:global:iam::company-xyz:accounts/*'],
      })
      .expect(400);

    const errorResponse: ValidationErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Validation failed');
    expect(
      errorResponse.fields?.some(
        (f) =>
          f.message.includes('Name is required') ||
          f.message.includes('Required')
      )
    ).toBe(true);
  });

  it('should return 400 for missing effect', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/policies`)
      .send({
        name: 'TestPolicy',
        actions: ['iam:accounts:read'],
        resources: ['grn:global:iam::company-xyz:accounts/*'],
      })
      .expect(400);

    const errorResponse: ValidationErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Validation failed');
    expect(
      errorResponse.fields?.some(
        (f) =>
          f.message.includes('Effect must be Allow or Deny') ||
          f.message.includes('Required')
      )
    ).toBe(true);
  });

  it('should return 400 for invalid effect', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/policies`)
      .send({
        name: 'TestPolicy',
        effect: 'Invalid',
        actions: ['iam:accounts:read'],
        resources: ['grn:global:iam::company-xyz:accounts/*'],
      })
      .expect(400);

    const errorResponse: ValidationErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Validation failed');
    expect(
      errorResponse.fields?.some(
        (f) =>
          f.message.includes('Effect must be Allow or Deny') ||
          f.message.includes('Invalid enum value')
      )
    ).toBe(true);
  });

  it('should return 400 for empty actions array', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/policies`)
      .send({
        name: 'TestPolicy',
        effect: 'Allow',
        actions: [],
        resources: ['grn:global:iam::company-xyz:accounts/*'],
      })
      .expect(400);

    const errorResponse: ValidationErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Validation failed');
    expect(
      errorResponse.fields?.some((f) =>
        f.message.includes('At least one action is required')
      )
    ).toBe(true);
  });

  it('should return 400 for empty resources array', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/policies`)
      .send({
        name: 'TestPolicy',
        effect: 'Allow',
        actions: ['iam:accounts:read'],
        resources: [],
      })
      .expect(400);

    const errorResponse: ValidationErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Validation failed');
    expect(
      errorResponse.fields?.some((f) =>
        f.message.includes('At least one resource is required')
      )
    ).toBe(true);
  });

  it('should return 409 for duplicate policy name', async () => {
    const policyData = {
      name: 'DuplicatePolicy',
      effect: 'Allow' as const,
      actions: ['iam:accounts:read'],
      resources: ['grn:global:iam::company-xyz:accounts/*'],
    };

    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/policies`)
      .send(policyData)
      .expect(201);

    await request(getApp().callback())
      .post(`/api/realm/${tenantId}/policies`)
      .send(policyData)
      .expect(409);
  });
});
