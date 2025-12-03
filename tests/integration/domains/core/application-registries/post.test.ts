import request from 'supertest';
import { describe, expect, it, beforeAll } from 'vitest';
import { getModel } from '@/domains/core/application-registries/application-registry.model';
import { ApplicationRegistryCreateResponse } from '@/domains/core/application-registries/application-registry.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';
import { v4 as uuidv4 } from 'uuid';

describe('POST /api/core/application-registries', () => {
  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    await getModel().createIndexes();
  });

  it('should create a new application registry successfully', async () => {
    const registryData = {
      applicationKey: `test-app-key-${uuidv4()}`,
      tenantId: 'test-tenant-id',
      applicationId: 'test-app-id',
    };

    const response = await request(getApp().callback())
      .post('/api/core/application-registries')
      .send(registryData)
      .expect(201);

    const registryResponse: ApplicationRegistryCreateResponse = response.body;
    expect(registryResponse).toHaveProperty('_id');
    expect(registryResponse.applicationKey).toBe(registryData.applicationKey);
    expect(registryResponse.tenantId).toBe(registryData.tenantId);
    expect(registryResponse.applicationId).toBe(registryData.applicationId);
  });

  it('should return 400 for missing applicationKey', async () => {
    const registryData = {
      tenantId: 'test-tenant',
      applicationId: 'test-app',
    };

    const response = await request(getApp().callback())
      .post('/api/core/application-registries')
      .send(registryData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 400 for missing tenantId', async () => {
    const registryData = {
      applicationKey: `test-key-${uuidv4()}`,
      applicationId: 'test-app',
    };

    const response = await request(getApp().callback())
      .post('/api/core/application-registries')
      .send(registryData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 400 for missing applicationId', async () => {
    const registryData = {
      applicationKey: `test-key-${uuidv4()}`,
      tenantId: 'test-tenant',
    };

    const response = await request(getApp().callback())
      .post('/api/core/application-registries')
      .send(registryData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 409 for duplicate applicationKey', async () => {
    const duplicateKey = `duplicate-key-${uuidv4()}`;

    await request(getApp().callback())
      .post('/api/core/application-registries')
      .send({
        applicationKey: duplicateKey,
        tenantId: 'tenant-1',
        applicationId: 'app-1',
      })
      .expect(201);

    const response = await request(getApp().callback())
      .post('/api/core/application-registries')
      .send({
        applicationKey: duplicateKey,
        tenantId: 'tenant-2',
        applicationId: 'app-2',
      })
      .expect(409);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Application key already exists');
  });

  it('should return 400 for empty applicationKey', async () => {
    const registryData = {
      applicationKey: '',
      tenantId: 'test-tenant',
      applicationId: 'test-app',
    };

    const response = await request(getApp().callback())
      .post('/api/core/application-registries')
      .send(registryData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });
});
