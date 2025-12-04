import { ErrorResponse } from '@/domains/commons/base/base.schema';
import { getModel } from '@/domains/core/application-registries/application-registry.model';
import { ApplicationRegistryCreateResponse } from '@/domains/core/application-registries/application-registry.schema';
import { EnvKey, setLocalMemValue } from '@/plugins/dotenv.plugin';
import { getAuthToken } from '@test/utils/auth.util';
import { getTenantId } from '@test/utils/tenant.util';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { beforeAll, describe, expect, it } from 'vitest';

describe('POST /api/core/application-registries', () => {
  let coreTenantId: string;
  let authToken: string;
  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    const coreDbName = 'vi-test-db-core-app-registry-post';
    setLocalMemValue(EnvKey.CORE_REALM_NAME, coreDbName);
    coreTenantId = await getTenantId(coreDbName);
    authToken = await getAuthToken(coreTenantId, 'app-registry.post.test');
    await getModel().createIndexes();
  });

  it('should create a new application registry successfully', async () => {
    const registryData = {
      applicationKey: uuidv4(),
      tenantId: uuidv4(),
      applicationId: uuidv4(),
    };

    const response = await request(getApp().callback())
      .post('/api/core/application-registries')
      .set('Authorization', `Bearer ${authToken}`)
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
      .set('Authorization', `Bearer ${authToken}`)
      .send(registryData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 400 for missing tenantId', async () => {
    const registryData = {
      applicationKey: uuidv4(),
      applicationId: uuidv4(),
    };

    const response = await request(getApp().callback())
      .post('/api/core/application-registries')
      .set('Authorization', `Bearer ${authToken}`)
      .send(registryData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 400 for missing applicationId', async () => {
    const registryData = {
      applicationKey: uuidv4(),
      tenantId: uuidv4(),
    };

    const response = await request(getApp().callback())
      .post('/api/core/application-registries')
      .set('Authorization', `Bearer ${authToken}`)
      .send(registryData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 409 for duplicate applicationKey', async () => {
    const duplicateKey = uuidv4();

    await request(getApp().callback())
      .post('/api/core/application-registries')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        applicationKey: duplicateKey,
        tenantId: uuidv4(),
        applicationId: uuidv4(),
      })
      .expect(201);

    const response = await request(getApp().callback())
      .post('/api/core/application-registries')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        applicationKey: duplicateKey,
        tenantId: uuidv4(),
        applicationId: uuidv4(),
      })
      .expect(409);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Resource already exists');
  });

  it('should return 400 for empty applicationKey', async () => {
    const registryData = {
      applicationKey: '',
      tenantId: 'test-tenant',
      applicationId: 'test-app',
    };

    const response = await request(getApp().callback())
      .post('/api/core/application-registries')
      .set('Authorization', `Bearer ${authToken}`)
      .send(registryData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });
});
